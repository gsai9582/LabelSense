import os
import json
import sqlite3
import re
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.ai.base import BaseLLMClient
from app.ai.prompts import SYSTEM_PROMPT_CLAUSE_RAG

DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "regulatory_clauses.db"))
REGS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "data", "regs"))

class MatchedClause(BaseModel):
    clause_id: str
    source_name: str
    section: str
    title: str
    excerpt: str
    relevance_score: float

class ClauseSearchResponse(BaseModel):
    query: str
    matched_clauses: List[MatchedClause]
    synthesized_answer: str
    disclaimer: str = "Note: Regulatory clause dataset is a curated sample for assistive verification, not the full statutory legal text."

class ClauseRAGService:
    @classmethod
    def _get_connection(cls) -> sqlite3.Connection:
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        con = sqlite3.connect(DB_PATH)
        con.row_factory = sqlite3.Row
        return con

    @classmethod
    def init_database(cls):
        """Create virtual table and ingest curated JSON regulatory clauses."""
        con = cls._get_connection()
        cur = con.cursor()
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS clauses (
                id TEXT PRIMARY KEY,
                source_name TEXT NOT NULL,
                section TEXT NOT NULL,
                title TEXT NOT NULL,
                text TEXT NOT NULL,
                keywords TEXT
            )
        """)
        
        cur.execute("""
            CREATE VIRTUAL TABLE IF NOT EXISTS clauses_fts USING fts5(
                id,
                source_name,
                section,
                title,
                text,
                content='clauses',
                content_rowid='rowid',
                tokenize='porter ascii'
            )
        """)
        
        # Check if already populated
        cur.execute("SELECT COUNT(*) as cnt FROM clauses")
        count = cur.fetchone()["cnt"]
        
        if count == 0 and os.path.exists(REGS_DIR):
            for filename in os.listdir(REGS_DIR):
                if filename.endswith(".json"):
                    filepath = os.path.join(REGS_DIR, filename)
                    try:
                        with open(filepath, "r", encoding="utf-8") as f:
                            items = json.load(f)
                            for item in items:
                                cur.execute("""
                                    INSERT OR REPLACE INTO clauses (id, source_name, section, title, text, keywords)
                                    VALUES (?, ?, ?, ?, ?, ?)
                                """, (
                                    item["id"],
                                    item["source_name"],
                                    item["section"],
                                    item["title"],
                                    item["text"],
                                    ", ".join(item.get("keywords", [])),
                                ))
                    except Exception as e:
                        print(f"Error loading {filename}: {e}")
            
            # Rebuild FTS index
            cur.execute("INSERT INTO clauses_fts(clauses_fts) VALUES('rebuild')")
            con.commit()
            
        con.close()

    @classmethod
    def search_clauses(cls, query: str, limit: int = 4, min_score: float = 0.15) -> List[MatchedClause]:
        cls.init_database()
        con = cls._get_connection()
        cur = con.cursor()
        
        # Clean query tokens for FTS5 syntax
        tokens = re.findall(r'\b[a-zA-Z0-9_\-\.]{2,}\b', query)
        if not tokens:
            con.close()
            return []
            
        # Build MATCH query with prefix search
        match_query = " OR ".join([f'"{tok}"*' for tok in tokens[:6]])
        
        results: List[MatchedClause] = []
        try:
            cur.execute("""
                SELECT c.id, c.source_name, c.section, c.title, c.text, bm25(clauses_fts) as rank
                FROM clauses_fts f
                JOIN clauses c ON f.id = c.id
                WHERE clauses_fts MATCH ?
                ORDER BY rank ASC
                LIMIT ?
            """, (match_query, limit))
            
            rows = cur.fetchall()
            for r in rows:
                raw_rank = abs(r["rank"])
                relevance = max(0.2, min(0.99, round(1.0 / (1.0 + raw_rank * 0.1), 2)))
                if relevance >= min_score:
                    results.append(
                        MatchedClause(
                            clause_id=r["id"],
                            source_name=r["source_name"],
                            section=r["section"],
                            title=r["title"],
                            excerpt=r["text"],
                            relevance_score=relevance,
                        )
                    )
        except Exception as e:
            print(f"FTS search error: {e}")
        finally:
            con.close()
            
        return results

    @classmethod
    async def query_regulatory_rag(cls, query: str, client: BaseLLMClient) -> ClauseSearchResponse:
        matched = cls.search_clauses(query)
        
        # Threshold check: If no relevant clause matched
        if not matched:
            return ClauseSearchResponse(
                query=query,
                matched_clauses=[],
                synthesized_answer="No matching clause found in the curated regulatory dataset.",
            )
            
        # Build prompt with exact excerpts
        context_blocks = "\n\n".join([
            f"[{c.clause_id}] {c.source_name} - {c.section} ({c.title}):\n\"{c.excerpt}\""
            for c in matched
        ])
        
        rag_prompt = f"""User Regulatory Query:
{query}

Retrieved Ground-Truth Regulatory Clauses:
{context_blocks}

Synthesize a concise, accurate answer strictly quoting and citing the relevant clause(s) above."""

        try:
            answer_text, meta = await client.generate_text(
                prompt=rag_prompt,
                system_instruction=SYSTEM_PROMPT_CLAUSE_RAG,
                temperature=0.1,
            )
        except Exception:
            # Fallback to direct citation of top matched clause
            top = matched[0]
            answer_text = f"Per {top.source_name} ({top.section}), \"{top.excerpt}\""

        return ClauseSearchResponse(
            query=query,
            matched_clauses=matched,
            synthesized_answer=answer_text,
        )
