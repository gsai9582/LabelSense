import React, { useState } from 'react';
import { KnowledgeGraph } from './KnowledgeGraph';
import { ECNSimulator } from './ECNSimulator';
import { TraversalResults } from './TraversalResults';
import { DigitalThreadNode, ECNScenario, ImpactAssessment } from '../../types';
import { ECN_SCENARIOS, MOCK_IMPACT_ASSESSMENT } from '../../data/mockLabelData';

interface ImpactModuleProps {
  onNavigateToAuthor: () => void;
}

export const ImpactModule: React.FC<ImpactModuleProps> = ({ onNavigateToAuthor }) => {
  const [selectedNode, setSelectedNode] = useState<DigitalThreadNode | null>(null);
  const [activeScenario, setActiveScenario] = useState<ECNScenario>(ECN_SCENARIOS[0]);
  const [isTraversing, setIsTraversing] = useState(false);
  const [assessment, setAssessment] = useState<ImpactAssessment>(MOCK_IMPACT_ASSESSMENT);

  const handleRunTraversal = (scenario: ECNScenario) => {
    setIsTraversing(true);
    setTimeout(() => {
      setIsTraversing(false);
      setAssessment({
        ...MOCK_IMPACT_ASSESSMENT,
        ecnId: scenario.id,
        ecoNumber: `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: scenario.title,
        justification: `Impact evaluation completed for ${scenario.title}. Traversing primary, secondary and shipper packaging across US, EU, JP, and UK jurisdictions. Automated synchronization of UDI AI (17) date tokens validated.`,
      });
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-190px)] min-h-[640px]">
      {/* Column 1: ECN Simulator (3 cols) */}
      <div className="lg:col-span-3 h-full">
        <ECNSimulator
          onRunTraversal={handleRunTraversal}
          isTraversing={isTraversing}
          activeScenario={activeScenario}
          setActiveScenario={setActiveScenario}
        />
      </div>

      {/* Column 2: Interactive Knowledge Graph Explorer (5 cols) */}
      <div className="lg:col-span-5 h-full">
        <KnowledgeGraph
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        />
      </div>

      {/* Column 3: Traversal Results & Auto-Drafted ECO (4 cols) */}
      <div className="lg:col-span-4 h-full">
        <TraversalResults
          assessment={assessment}
          onProceedToAuthor={onNavigateToAuthor}
        />
      </div>
    </div>
  );
};
