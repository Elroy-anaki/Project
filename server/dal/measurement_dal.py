from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from models.measurements import Measurement

class MeasurementDal:
    def __init__(self, db: Session):
        self.db = db
        
    def create_measurement(self, measurement_details):
        try:
            new_measurement = Measurement(**measurement_details)
            self.db.add(new_measurement)
            self.db.commit()
            self.db.refresh(new_measurement)
            return new_measurement.to_json()
        except Exception as e:
            self.db.rollback()
            raise e
    def get_all_measurement_by_serial_number(self, serial_number):
        try:
            measurements = (
                self.db.query(Measurement)
                .filter(Measurement.serial_number == serial_number)
                .all()
            )
            return [m.to_json() for m in measurements]
        except Exception as e:
            raise e
            
    