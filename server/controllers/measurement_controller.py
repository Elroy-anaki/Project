from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from services.measurement_service import MeasurementService

class MeasurementContoller:
    def __init__(self, db: Session):
        self.measurement_service = MeasurementService(db)
        
    async def create_measurement(self, request: Request,response: Response):
        try:
            measurement_details = await request.json()
            new_measurement = await self.measurement_service.create_measurement(measurement_details)
            
            return JSONResponse(
                status_code=201,
                content={"success": True, "data": new_measurement}
            )
        except Exception as e:
            raise e