import pytest
from app.services.gs1_validator import GS1Validator

def test_modulo10_gtin14_standard():
    # CardiaVance baseline payload: 0084012345678 (sum = 104, 110 - 104 = 6)
    check_digit = GS1Validator.calculate_modulo10_check_digit("0084012345678")
    assert check_digit == 6

def test_modulo10_gtin13_ean13():
    # Payload: 400638133393 -> Check digit should be 1
    check_digit = GS1Validator.calculate_modulo10_check_digit("400638133393")
    assert check_digit == 1

def test_modulo10_gtin12_upca():
    # Payload: 01234567890 -> Check digit should be 5
    check_digit = GS1Validator.calculate_modulo10_check_digit("01234567890")
    assert check_digit == 5

def test_modulo10_gtin8():
    # Payload: 9638507 -> Check digit should be 4
    check_digit = GS1Validator.calculate_modulo10_check_digit("9638507")
    assert check_digit == 4

def test_modulo10_zero_remainder():
    # Payload resulting in exact multiple of 10
    check_digit = GS1Validator.calculate_modulo10_check_digit("0000000000000")
    assert check_digit == 0

def test_validate_gtin_valid():
    res = GS1Validator.validate_gtin("00840123456786")
    assert res["is_valid"] is True
    assert res["format"] == "GTIN-14"
    assert res["calculated_check_digit"] == 6

def test_validate_gtin_check_digit_mismatch():
    res = GS1Validator.validate_gtin("00840123456789") # Provided 9, expected 6
    assert res["is_valid"] is False
    assert res["error_code"] == "CHECK_DIGIT_MISMATCH"
    assert res["calculated_check_digit"] == 6
    assert res["provided_check_digit"] == 9

def test_validate_gtin_invalid_length():
    res = GS1Validator.validate_gtin("12345")
    assert res["is_valid"] is False
    assert res["error_code"] == "INVALID_LENGTH"

def test_validate_gtin_non_numeric():
    res = GS1Validator.validate_gtin("0084012345678A")
    assert res["is_valid"] is False
    assert res["error_code"] == "NON_NUMERIC_GTIN"
