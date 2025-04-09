import pytest
import math
from core.rpn.calculator import RPNCalculator

# Initialize calculator instance
calculator = RPNCalculator()

# Test basic operations
def test_basic_addition():
    result = calculator.calculate("3 4 +")
    assert result["result"] == 7
    assert len(result["operations"]) == 1
    assert result["operations"][0]["operands"] == [3, 4]
    assert result["operations"][0]["operator"] == "+"
    assert result["operations"][0]["result"] == 7

def test_chained_operations():
    result = calculator.calculate("5 6 + 2 *")
    assert result["result"] == 22

def test_order_of_operations():
    result = calculator.calculate("3 4 2 * +")
    assert result["result"] == 11

def test_division_and_subtraction():
    result = calculator.calculate("20 5 / 2 -")
    assert result["result"] == 2

# Test advanced operations
def test_square_root():
    result = calculator.calculate("16 sqrt")
    assert result["result"] == 4

def test_trigonometric():
    result = calculator.calculate("45 sin")
    # Use pytest.approx for floating point comparison
    assert result["result"] == pytest.approx(math.sin(math.radians(45)))

def test_factorial():
    result = calculator.calculate("5 !")
    assert result["result"] == 120

def test_logarithm():
    result = calculator.calculate("100 log")
    assert result["result"] == 2

# Test constants
def test_pi():
    result = calculator.calculate("pi")
    assert result["result"] == pytest.approx(math.pi)

def test_e():
    result = calculator.calculate("e")
    assert result["result"] == pytest.approx(math.e)

# Test complex expressions
def test_complex_expression1():
    result = calculator.calculate("3 4 + 5 * sqrt")
    assert result["result"] == pytest.approx(math.sqrt(35))

def test_complex_expression2():
    result = calculator.calculate("2 3 ^ 4 + 5 /")
    assert result["result"] == pytest.approx(12/5)

# Test error handling
def test_division_by_zero():
    with pytest.raises(ValueError) as excinfo:
        calculator.calculate("5 0 /")
    assert "Division by zero" in str(excinfo.value)

def test_invalid_expression():
    with pytest.raises(ValueError) as excinfo:
        calculator.calculate("1 +")
    assert "Insufficient operands" in str(excinfo.value)

def test_empty_expression():
    with pytest.raises(ValueError) as excinfo:
        calculator.calculate("")
    assert "Expression cannot be empty" in str(excinfo.value) 