from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from middleware.database_middleware import get_db
from controllers.device_customer_controller import DeviceCustomerController

device_customer_router = APIRouter()

@device_customer_router.post("/")
async def create_device_customer(request: Request,response: Response, db: Session = Depends(get_db)):
    try:
        controller = DeviceCustomerController(db=db)
        return await controller.create_device_customer(request=request, response=response)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="failed creating a device_customer")
    


