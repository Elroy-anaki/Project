from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from middleware.database_middleware import get_db
from controllers.measurement_controller import MeasurementContoller
from utils.utilsService import UtilsService


measurements_router = APIRouter()

@measurements_router.post("/")
async def create_measurement(request: Request,response: Response, db: Session = Depends(get_db)):
    try:
        controller = MeasurementContoller(db)
        return await controller.create_measurement(request, response)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="failed creating a measurement")
    
@measurements_router.get("/{serial_number}")
async def get_all_measurement_by_serial_number(
    serial_number: str,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
):
    try:
        controller = MeasurementContoller(db)
        return await controller.get_all_measurement_by_serial_number(serial_number)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")

        
@measurements_router.get("/{serial_number}/input-values")
async def get_all_input_values_by_serial_number(
    serial_number: str,
    request: Request,
    response: Response,
    db: Session = Depends(get_db)
): 
    try:
        controller = MeasurementContoller(db)
        return await controller.get_all_input_values_by_serial_number(serial_number)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
       
        
@measurements_router.get("/{serial_number}/{input_value}/predict-calibration")
async def predict_calibration_by_serial_number_and_input(
    serial_number: str,
    input_value: float,
): 
    try:
        print("Currect path... calibaration")
        utils_service = UtilsService()
        return utils_service.predict_calibration_by_serial_number_and_input(serial_number, float(input_value))
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
       