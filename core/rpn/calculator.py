from typing import List, Union, Dict, Any
import operator
from enum import Enum
import logging
import math

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OperationType(Enum):
    ADDITION = "+"
    SUBTRACTION = "-"
    MULTIPLICATION = "*"
    DIVISION = "/"
    POWER = "^"
    SQUARE_ROOT = "sqrt"
    SINE = "sin"
    COSINE = "cos"
    TANGENT = "tan"
    LOGARITHM = "log"
    NATURAL_LOG = "ln"
    FACTORIAL = "!"
    MODULO = "%"
    

class RPNCalculator:
    """
    A Reverse Polish Notation calculator implementation.
    Evaluates expressions where operators follow their operands.
    """
    
    def __init__(self):
        # Define the supported operations
        self.operations = {
            # Basic arithmetic
            "+": operator.add,
            "-": operator.sub,
            "*": operator.mul,
            "/": operator.truediv,
            "^": operator.pow,
            "%": operator.mod,
            
            # Advanced operations
            "sqrt": lambda x: math.sqrt(x),
            "sin": lambda x: math.sin(math.radians(x)),
            "cos": lambda x: math.cos(math.radians(x)),
            "tan": lambda x: math.tan(math.radians(x)),
            "log": lambda x: math.log10(x),
            "ln": lambda x: math.log(x),
            "!": self.factorial  # Use custom factorial function
        }
        
        # Define arity (number of operands) for each operation
        self.arity = {
            "+": 2,
            "-": 2,
            "*": 2,
            "/": 2,
            "^": 2,
            "%": 2,
            "sqrt": 1,
            "sin": 1,
            "cos": 1,
            "tan": 1,
            "log": 1,
            "ln": 1,
            "!": 1
        }
    
    def factorial(self, n):
        """
        Calculate factorial with robust validation.
        """
        # Convert float to int if it's a whole number
        if isinstance(n, float):
            if n.is_integer():
                n = int(n)
            else:
                raise ValueError("Factorial is only defined for non-negative integers")
        
        # Validate integer input
        if not isinstance(n, int):
            raise ValueError("Factorial is only defined for non-negative integers")
        
        if n < 0:
            raise ValueError("Factorial is only defined for non-negative integers")
            
        return math.factorial(n)
    
    def calculate(self, expression: str) -> Dict[str, Any]:
        """
        Evaluates an RPN expression and returns the result.
        
        Args:
            expression: A string containing numbers and operators in RPN format
                        (e.g., "3 4 + 2 *")
        
        Returns:
            A dictionary containing the result and execution details
        
        Raises:
            ValueError: If the expression is invalid or operations cannot be performed
        """
        # Split the expression into tokens
        tokens = expression.strip().split()
        
        if not tokens:
            raise ValueError("Expression cannot be empty")
        
        stack = []
        operations_log = []
        
        try:
            for token in tokens:
                if token in self.operations:
                    # Get the required number of operands for this operation
                    required_operands = self.arity[token]
                    
                    # Check if we have enough operands
                    if len(stack) < required_operands:
                        raise ValueError(f"Insufficient operands for operator '{token}'")
                    
                    # For unary operations
                    if required_operands == 1:
                        a = stack.pop()
                        
                        # Special case validations
                        if token == "sqrt" and a < 0:
                            raise ValueError("Cannot calculate square root of a negative number")
                        if (token == "log" or token == "ln") and a <= 0:
                            raise ValueError("Cannot calculate logarithm of zero or negative number")
                        
                        # Perform the operation
                        result = self.operations[token](a)
                        stack.append(result)
                        
                        # Log the operation
                        operations_log.append({
                            "operator": token,
                            "operands": [a],
                            "result": result
                        })
                        
                    # For binary operations    
                    else:
                        b = stack.pop()
                        a = stack.pop()
                        
                        # Special case for division by zero
                        if token == "/" and b == 0:
                            raise ValueError("Division by zero is not allowed")
                        if token == "%" and b == 0:
                            raise ValueError("Modulo by zero is not allowed")
                        
                        # Perform the operation
                        result = self.operations[token](a, b)
                        stack.append(result)
                        
                        # Log the operation
                        operations_log.append({
                            "operator": token,
                            "operands": [a, b],
                            "result": result
                        })
                
                # Special constants
                elif token.lower() == "pi":
                    stack.append(math.pi)
                elif token.lower() == "e":
                    stack.append(math.e)
                    
                else:
                    # Try to convert token to number
                    try:
                        value = float(token)
                        # Convert to int if it's a whole number
                        if value.is_integer():
                            value = int(value)
                        stack.append(value)
                    except ValueError:
                        raise ValueError(f"Invalid token: {token}")
            
            # After processing all tokens, stack should contain exactly one value
            if len(stack) != 1:
                raise ValueError("Invalid expression: too many operands")
            
            final_result = stack[0]
            
            return {
                "expression": expression,
                "result": final_result,
                "operations": operations_log
            }
            
        except Exception as e:
            logger.error(f"Error calculating expression '{expression}': {str(e)}")
            raise