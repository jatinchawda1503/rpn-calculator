from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import csv
import io

from core.rpn import RPNCalculator
from core.db import get_db, User, Calculation
from pydantic import BaseModel
from typing import Optional, List


router = APIRouter()
calculator = RPNCalculator()

class CalculateRequest(BaseModel):
    expression: str
    user_id: str = "anonymous"
    result: Optional[float] = None

class CalculateResponse(BaseModel):
    result: float
    operations: List[dict] = []

@router.post("/calculate", response_model=CalculateResponse)
async def calculate(request: CalculateRequest, db: Session = Depends(get_db)):
    try:
        # Check if we've received a pre-calculated result
        if request.result is not None:
            # This is a request from the RPN calculator with a calculation already done
            result = {
                'result': request.result,
                'operations': []  # Client-side RPN calculator doesn't produce operations
            }
            
            # Ensure user exists
            user = db.query(User).filter(User.id == request.user_id).first()
            if not user:
                user = User(id=request.user_id)
                db.add(user)
                db.commit()
            
            # Save calculation with provided result
            calculation = Calculation(
                user_id=request.user_id,
                expression=request.expression,
                result=request.result
            )
            db.add(calculation)
            db.commit()
        else:
            # Traditional server-side calculation
            calc_result = calculator.calculate(request.expression)
            result = calc_result
            
            # Ensure user exists
            user = db.query(User).filter(User.id == request.user_id).first()
            if not user:
                user = User(id=request.user_id)
                db.add(user)
                db.commit()
            
            # Save the calculation
            calculation = Calculation(
                user_id=request.user_id,
                expression=request.expression,
                result=calc_result["result"],
                operations=calc_result.get("operations", [])
            )
            db.add(calculation)
            db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/history/{user_id}")
async def get_history(user_id: str, limit: int = 50, db: Session = Depends(get_db)):
    calculations = db.query(Calculation)\
        .filter(Calculation.user_id == user_id)\
        .order_by(Calculation.timestamp.desc())\
        .limit(limit)\
        .all()
    
    return calculations

@router.get("/history")
async def get_all_history(limit: int = 50, db: Session = Depends(get_db)):
    calculations = db.query(Calculation)\
        .order_by(Calculation.timestamp.desc())\
        .limit(limit)\
        .all()
    
    return calculations

@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...), 
    user_id: str = Form("anonymous"),
    db: Session = Depends(get_db)
):
    try:
        # Ensure user exists
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            user = User(id=user_id)
            db.add(user)
            db.commit()
        
        # Process the CSV file
        contents = await file.read()
        buffer = io.StringIO(contents.decode('utf-8'))
        reader = csv.reader(buffer)
        
        results = []
        for row in reader:
            if not row:
                continue
                
            expression = row[0].strip()
            if not expression:
                continue
                
            try:
                # Calculate the expression
                calc_result = calculator.calculate(expression)
                
                # Save the calculation
                calculation = Calculation(
                    user_id=user_id,
                    expression=expression,
                    result=calc_result["result"],
                    operations=calc_result.get("operations", [])
                )
                db.add(calculation)
                
                # Add to results
                results.append({
                    "expression": expression,
                    "result": calc_result["result"]
                })
            except Exception as e:
                results.append({
                    "expression": expression,
                    "error": str(e)
                })
        
        db.commit()
        
        return {
            "success": True,
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/supported-operations")
async def get_supported_operations():
    operations = {
        "basic_operators": ["+", "-", "*", "/", "^", "%"],
        "functions": ["sqrt", "sin", "cos", "tan", "log", "ln", "!"],
        "constants": ["pi", "e"]
    }
    return operations 