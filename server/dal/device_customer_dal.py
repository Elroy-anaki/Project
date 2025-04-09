
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from models.device_customer import DeviceCustomer


class DeviceCustomerDal:
    def __init__(self, db: Session):
        self.db = db
        
    async def create_device_customer(self, device_customer_details):
        try:
            new_device_customer = DeviceCustomer(**device_customer_details)
            self.db.add(new_device_customer)
            self.db.commit()
            self.db.refresh(new_device_customer)
            return new_device_customer.to_json()
        except Exception as e:
            raise e