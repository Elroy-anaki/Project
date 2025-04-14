
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from dal.device_customer_dal import DeviceCustomerDal

class DeviceCustomerService:
    def __init__(self, db: Session):
        self.device_customer_dal = DeviceCustomerDal(db=db)
        
        
    async def create_device_customer(self, device_customer_details):
        try:
            return await self.device_customer_dal.create_device_customer(device_customer_details)
        except Exception as e:
            raise e
    async def get_devices_by_customer_id(self, customer_id: int):
        try:
            return await self.device_customer_dal.get_devices_by_customer_id(customer_id)
        except Exception as e:
            raise e