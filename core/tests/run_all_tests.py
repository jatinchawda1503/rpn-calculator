#!/usr/bin/env python3
"""
Script to run all test cases for the RPN Calculator core package.
"""

import os
import sys
import pytest
import importlib
import unittest

def run_pytest_tests():
    """Run all pytest-based tests in the current directory."""
    print("\n" + "=" * 50)
    print("Running pytest tests...")
    print("=" * 50)
    
    # Create the pytest command
    pytest_args = ["-v", os.path.dirname(__file__)]
    
    # Run the tests
    result = pytest.main(pytest_args)
    
    return result == 0  # Return True if all tests passed

def run_standalone_tests():
    """Run all standalone test scripts in the current directory."""
    print("\n" + "=" * 50)
    print("Running standalone test scripts...")
    print("=" * 50)
    
    current_dir = os.path.dirname(__file__)
    success = True
    
    # Find all standalone test files
    for filename in os.listdir(current_dir):
        if (filename.endswith("_test.py") and 
            filename != "run_all_tests.py" and
            filename != "__init__.py"):
            
            module_name = filename[:-3]  # Remove .py extension
            print(f"\nRunning test: {filename}")
            print("-" * 40)
            
            try:
                # Construct module path
                module_path = f"core.tests.{module_name}"
                
                # Import and run the module
                module = importlib.import_module(module_path)
                
                # If module has a main function, call it
                if hasattr(module, "main"):
                    module.main()
                # If it has a test_* function, call it
                else:
                    for name in dir(module):
                        if name.startswith("test_") and callable(getattr(module, name)):
                            getattr(module, name)()
                            break
            except Exception as e:
                print(f"Error running {filename}: {e}")
                success = False
                
    return success

def run_unittest_tests():
    """Discover and run unittest-based tests."""
    print("\n" + "=" * 50)
    print("Running unittest tests...")
    print("=" * 50)
    
    # Create test loader and find tests
    loader = unittest.TestLoader()
    tests = loader.discover(os.path.dirname(__file__))
    
    # Run the tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(tests)
    
    return result.wasSuccessful()

def main():
    """Run all the tests."""
    print("RPN Calculator Core - Running All Tests")
    print("=" * 50)
    
    # Track test results
    results = []
    
    # Run pytest tests
    results.append(("Pytest tests", run_pytest_tests()))
    
    # Run standalone test scripts
    results.append(("Standalone tests", run_standalone_tests()))
    
    # Run unittest tests
    results.append(("Unittest tests", run_unittest_tests()))
    
    # Report results
    print("\n" + "=" * 50)
    print("Test Results Summary")
    print("=" * 50)
    
    for test_name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    # Determine overall success
    all_passed = all(passed for _, passed in results)
    print("\nOverall result:", "✅ PASSED" if all_passed else "❌ FAILED")
    
    # Return success code
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main()) 