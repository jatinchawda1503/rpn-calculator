from setuptools import setup, find_packages

setup(
    name="rpn_calculator_core",
    version="0.1.0",
    description="Core functionality for RPN Calculator",
    author="RPN Calculator Team",
    packages=find_packages(),
    python_requires=">=3.8",
    install_requires=[
        "sqlalchemy>=2.0.0",
    ],
) 