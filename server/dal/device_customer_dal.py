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
            print("Created!!!!!!!")
            return new_device_customer.to_json()
        except Exception as e:
            print("error", e)
            raise e
        
    async def get_devices_by_customer_id(self, customer_id: int):
        try:
            devices = (
                self.db.query(DeviceCustomer)
                .filter(DeviceCustomer.customer_id == customer_id)
                .all()
            )
            return [device.to_json() for device in devices]
        except Exception as e:
            print("error", e)
            raise e
            
    async def get_device_by_serial_number(self, serial_number: str):
        try:
            device = (
                self.db.query(DeviceCustomer)
                .filter(DeviceCustomer.serial_number == serial_number)
                .first()
            )
            return device.to_json() if device else None
        except Exception as e:
            print("error", e)
            raise e
