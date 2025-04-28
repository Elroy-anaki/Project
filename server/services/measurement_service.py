from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from dal.measurement_dal import MeasurementDal

class MeasurementService:
    def __init__(self, db: Session):
        self.measurement_dal = MeasurementDal(db)
        
    async def create_measurement(self, measurement_details):
        try:
            measurement = self.measurement_dal.create_measurement(measurement_details=measurement_details)
            return measurement
        except Exception as e:
            raise e
        
    async def get_all_measurement_by_serial_number(self, serial_number):
        try:
            measurements = self.measurement_dal.get_all_measurement_by_serial_number(serial_number=serial_number)
            return measurements
        except Exception as e:
            raise e
    async def get_all_input_values_by_serial_number(self, serial_number):
        try:
            measurements = self.measurement_dal.get_all_input_values_by_serial_number(serial_number=serial_number)
            return measurements
        except Exception as e:
            raise e
        
    async def get_all_get_identifiers_by_serial_number(self, serial_number: str):
        try:
            identifiers = self.measurement_dal.get_all_get_identifiers_by_serial_number(serial_number=serial_number)
            return identifiers
        except Exception as e:
            raise e