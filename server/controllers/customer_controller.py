
from datetime import timedelta
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from fastapi import APIRouter, Request, Response, HTTPException
from services.customer_service import CustomerService

class CustomerController:
    
    def __init__(self):
        super().__init__()
        self.customer_service = CustomerService()
        
    async def login(self, request: Request,response: Response, db: Session):
        try:
            data = await request.json()
            customer_email = data.get("customer_email")
            customer_password = data.get("customer_password")
            
            if not customer_email or not customer_password:
                raise HTTPException(status_code=400, detail="missing name or password")
            
            
            expiration_time = timedelta(days=1)
            
            result = await self.customer_service.login(db=db, customer_details=data, expiration_time=expiration_time)
            token = result["token"]
            customer = result["customer"]
            print("token", token)
            print("customer", customer)
            
            response = JSONResponse(
            content={"data": customer},
            status_code=200
        )
            response.set_cookie(
            key="access_token",
            value=token,
            max_age=expiration_time.total_seconds(),
            expires=expiration_time,
            httponly=True,
            secure=True,
            samesite="None"
        )

            return response
        
            
        except Exception as e:
            raise e
        

    async def sign_up(self, request: Request, db: Session):
        try:
            customer_details = await request.json()
            customer_name = customer_details.get("customer_name")
            print("customer_name",customer_name)
            customer_password = customer_details.get("customer_password")
            
            if not customer_name or not customer_password:
                raise HTTPException(status_code=400, detail="missing name or password")
            
            hashed_password = await self.customer_service.hashPassword(customer_password)
            customer_details["customer_password"] = hashed_password
            print("HASH")
            new_customer = await self.customer_service.customer_dal.create_customer(db=db, customer_details=customer_details)
            return {"ok": True, "new_customer": new_customer}
            
        except Exception as e:
            print(e)
            raise e
        
customer_controller = CustomerController()
        