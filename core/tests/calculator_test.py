#!/usr/bin/env python3
"""
Comprehensive test script for the RPN calculator.
You can run this script directly to test the calculator.
"""

from core.rpn import RPNCalculator

def run_test(expression, expected=None):
    """Run a test for the given expression and print the result."""
    calculator = RPNCalculator()
    print(f"\nTesting expression: '{expression}'")
    
    try:
        result = calculator.calculate(expression)
        print(f"Result: {result['result']}")
        
        if "operations" in result and result["operations"]:
            print("\nOperations:")
            for op in result["operations"]:
                if len(op["operands"]) == 1:
                    print(f"  {op['operator']}({op['operands'][0]}) = {op['result']}")
                else:
                    print(f"  {op['operands'][0]} {op['operator']} {op['operands'][1]} = {op['result']}")
                    
        if expected is not None:
            if abs(result["result"] - expected) < 0.0001:
                print("\nTest PASSED ✓")
            else:
                print(f"\nTest FAILED ✗ (Expected: {expected})")
                
    except Exception as e:
        print(f"Error: {str(e)}")
        if expected is None:  # If we expect an error
            print("\nTest PASSED ✓ (Expected error)")
        else:
            print("\nTest FAILED ✗ (Unexpected error)")
    
    print("-" * 40)

def main():
    print("RPN Calculator Test\n" + "=" * 20)
    
    # Test basic operations
    run_test("3 4 +", 7)
    run_test("5 6 + 2 *", 22)
    run_test("3 4 2 * +", 11)
    run_test("20 5 / 2 -", 2)
    
    # Test advanced operations
    run_test("16 sqrt", 4)
    run_test("45 sin", 0.7071)  # sin(45°) ≈ 0.7071
    run_test("5 !", 120)
    run_test("100 log", 2)
    
    # Test constants
    run_test("pi", 3.14159)
    run_test("e", 2.71828)
    
    # Test complex expressions
    run_test("3 4 + 5 * sqrt", 5.916)
    run_test("2 3 ^ 4 + 5 /", 2.4)
    
    # Test error cases
    run_test("5 0 /", None)  # Expected error
    run_test("1 +", None)    # Expected error
    run_test("", None)       # Expected error
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main() 