import pytest
import datetime
from app.services.gs1_validator import GS1Validator

def test_gs1_date_standard_yymmdd():
    # 281130 -> 2028-11-30
    res = GS1Validator.validate_gs1_date("281130")
    assert res["is_valid"] is True
    assert res["iso_date"] == "2028-11-30"
    assert res["is_expired"] is False

def test_gs1_date_day_00_convention():
    # 280200 -> February 2028 (Leap year, 29 days)
    res = GS1Validator.validate_gs1_date("280200")
    assert res["is_valid"] is True
    assert res["iso_date"] == "2028-02-29"

def test_gs1_date_leap_year_valid():
    # 240229 -> 2024-02-29
    res = GS1Validator.validate_gs1_date("240229")
    assert res["is_valid"] is True
    assert res["iso_date"] == "2024-02-29"

def test_gs1_date_non_leap_year_invalid():
    # 230229 -> 2023 is not a leap year
    res = GS1Validator.validate_gs1_date("230229")
    assert res["is_valid"] is False
    assert res["error_code"] == "INVALID_CALENDAR_DAY"

def test_gs1_date_invalid_month():
    # Month 13
    res = GS1Validator.validate_gs1_date("281301")
    assert res["is_valid"] is False
    assert res["error_code"] == "INVALID_MONTH"

def test_gs1_date_expired():
    # 100101 -> 2010-01-01
    res = GS1Validator.validate_gs1_date("100101")
    assert res["is_valid"] is True
    assert res["is_expired"] is True
    assert res["days_remaining"] < 0
