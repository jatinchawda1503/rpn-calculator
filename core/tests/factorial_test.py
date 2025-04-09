#!/usr/bin/env python3
"""
Test script specifically for the factorial functionality of the RPN calculator.
"""

from core.rpn import RPNCalculator

calculator = RPNCalculator()

def test_factorial():
    print("Testing factorial operation...")
    
    # Test with integer
    print("\nTesting factorial with integer input:")
    try:
        result = calculator.calculate("5 !")
        print(f"5! = {result['result']}")
        assert result['result'] == 120, "5! should be 120"
        print("✓ Test passed")
    except Exception as e:
        print(f"✗ Test failed: {e}")
    
    # Test with float that's an integer
    print("\nTesting factorial with float input that represents an integer:")
    try:
        result = calculator.calculate("5.0 !")
        print(f"5.0! = {result['result']}")
        assert result['result'] == 120, "5.0! should be 120"
        print("✓ Test passed")
    except Exception as e:
        print(f"✗ Test failed: {e}")
    
    # Test with negative number (should fail)
    print("\nTesting factorial with negative number (should fail):")
    try:
        result = calculator.calculate("-1 !")
        print("✗ Test failed: Should have raised an error")
    except ValueError as e:
        print(f"✓ Test passed: {e}")
    except Exception as e:
        print(f"✗ Test failed with unexpected error: {e}")
    
    # Test with non-integer (should fail)
    print("\nTesting factorial with non-integer (should fail):")
    try:
        result = calculator.calculate("5.5 !")
        print("✗ Test failed: Should have raised an error")
    except ValueError as e:
        print(f"✓ Test passed: {e}")
    except Exception as e:
        print(f"✗ Test failed with unexpected error: {e}")

if __name__ == "__main__":
    print("RPN Calculator Factorial Test\n" + "=" * 30)
    test_factorial()
    print("\nAll tests completed") 