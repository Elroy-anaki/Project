
from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from services.device_customer_service import DeviceCustomerService

class DeviceCustomerController:
    def __init__(self, db: Session):
        self.device_customer_service = DeviceCustomerService(db=db)
        
    async def create_device_customer(self, request: Request,response: Response):
        try:
            device_customer_data =  await request.json()
            new_device_customer = await self.device_customer_service.create_device_customer(device_customer_data)
            return JSONResponse(content= {"succes": True, "data": new_device_customer}, status_code= 201)
            
        except Exception as e:
            raise e
    async def get_devices_by_customer_id(self, request: Request,response: Response):
        try:
            customer_id = request.path_params["customer_id"]
            devices_customer = await self.device_customer_service.get_devices_by_customer_id(customer_id)
            return JSONResponse(content= {"succes": True, "data": devices_customer}, status_code= 201)
            
        except Exception as e:
            raise e

