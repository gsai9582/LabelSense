import pytest
from app.services.gs1_parser import GS1AIParser

def test_parse_bracketed_gs1_stream():
    stream = "(01)00840123456786(17)281130(10)2026L482(21)SER9981"
    parsed = GS1AIParser.parse_bracketed_stream(stream)
    assert parsed["01"] == "00840123456786"
    assert parsed["17"] == "281130"
    assert parsed["10"] == "2026L482"
    assert parsed["21"] == "SER9981"

def test_parse_raw_fnc1_stream():
    # 01 (14 digits) + 17 (6 digits) + 10 (variable length terminated by FNC1 \x1d) + 21
    stream = "010084012345678617281130102026L482\x1d21SER9981"
    parsed = GS1AIParser.parse_raw_fnc1_stream(stream)
    assert parsed["01"] == "00840123456786"
    assert parsed["17"] == "281130"
    assert parsed["10"] == "2026L482"
    assert parsed["21"] == "SER9981"

def test_extract_fields_from_ocr_text():
    sample_ocr = (
        "CardiaVance™ Bipolar Pacing Lead 58cm\n"
        "REF 8401-LEAD\n"
        "LOT 2026L482\n"
        "EXP 2028-11-30\n"
        "GTIN 00840123456786\n"
        "Manufacturer: MedTech Innovations Europe Ltd.\n"
        "STERILE EO  CE 0123  DO NOT RE-USE"
    )
    fields = GS1AIParser.extract_label_fields_from_text(sample_ocr)
    assert fields["sku"] == "8401-LEAD"
    assert fields["lot"] == "2026L482"
    assert fields["exp_date"] == "2028-11-30"
    assert fields["gtin"] == "00840123456786"
    assert fields["manufacturer_name"] == "MedTech Innovations Europe Ltd."
    assert "SYM-STERILE-EO" in fields["symbols"]
    assert "SYM-CE-0123" in fields["symbols"]
    assert fields["confidence_scores"]["gtin"] >= 0.90
