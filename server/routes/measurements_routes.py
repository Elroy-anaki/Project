from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from middleware.database_middleware import get_db
from controllers.measurement_controller import MeasurementContoller


measurements_router = APIRouter()

@measurements_router.post("/")
async def create_measurement(request: Request,response: Response, db: Session = Depends(get_db)):
    try:
        controller = MeasurementContoller(db)
        return await controller.create_measurement(request, response)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="failed creating a measurement")

