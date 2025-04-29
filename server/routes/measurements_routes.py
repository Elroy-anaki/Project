from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from middleware.database_middleware import get_db 
from controllers.measurement_controller import MeasurementContoller
from utils.utilsService import UtilsService 
from utils import alg


measurements_router = APIRouter()

@measurements_router.post("/")
async def create_measurement(request: Request,response: Response, db: Session = Depends(get_db)):
    try:
        controller = MeasurementContoller(db)
        return await controller.create_measurement(request, response)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="failed creating a measurement")


@measurements_router.get("/summarize-input-values")
async def summarize_input_values():
    try:
        print("Currect path... summarize_input_values")
        utils_service = UtilsService()
        return await utils_service.summarize_input_values()
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")

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
    
@measurements_router.post("/{serial_number}/predict-uncertainty")
async def predict_uncertainty_by_serial_number(serial_number: str, request: Request):
    try:
        print("Currect path... uncertainty")
        utils_service = UtilsService()
        return await utils_service.predict_uncertainty_by_serial_number(serial_number, request)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
    
@measurements_router.get("/{serial_number}/identifiers")
async def get_identifier_by_serial_number(serial_number: str, request: Request, db: Session = Depends(get_db)):
    try:
        controller = MeasurementContoller(db)
        return await controller.get_all_get_identifiers_by_serial_number(serial_number)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
    
    
@measurements_router.post("/{serial_number}/calibration-interval")
async def find_caliaration_interval(serial_number: str, request: Request):
    try:
        print("calibaration")
        utils_service = UtilsService()
        return await utils_service.find_calibration_interval(serial_number, request)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
    
    
@measurements_router.post("/{serial_number}/write-calibration-certificate")
async def write_calibration_certificate(serial_number: str, request: Request):
    try:
        print("write-calibration-certificate")
        utils_service = UtilsService()
        return await utils_service.write_calibration_certificate(serial_number, request)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
    
    
@measurements_router.post("/{serial_number}/predict-for-nonexisting-input")
async def predict_for_nonexisting_input(serial_number: str, request: Request):
    try:
        print("write-calibration-certificate")
        utils_service = UtilsService()
        return await utils_service.predict_for_nonexisting_input(serial_number, request)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
        
@measurements_router.post("/{serial_number}/compare-deviations-uncertainties")
async def compare_deviations_uncertainties(serial_number: str, request: Request):
    try:
        print("compare-deviations-uncertainties")
        utils_service = UtilsService()
        return await utils_service.compare_deviations_uncertainties(serial_number, request)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
    
@measurements_router.post("/{serial_number}/percentage-pass-deviation-uncertainty-validation")
async def predict_for_nonexisting_input(serial_number: str, request: Request):
    try:
        print("percentage-pass-deviation-uncertainty-validation")
        utils_service = UtilsService()
        return await utils_service.percentage_pass_deviation_uncertainty_validation(serial_number, request)
    except Exception as e:
        print("error", e)
        raise HTTPException(status_code=500, detail="failed featching a measurement")
        

