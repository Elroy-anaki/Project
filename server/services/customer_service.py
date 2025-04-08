from fastapi import HTTPException
from services.auth_service import AuthService
from dal.customer import CustomerDal
from sqlalchemy.orm import Session



class CustomerService(AuthService):
    
    def __init__(self):
        super().__init__()
        self.customer_dal = CustomerDal()
        
        
    async def login(self, db: Session, customer_details: dict, expiration_time):
        try:
            customer = await self.customer_dal.get_customer_by_email(db, customer_details["customer_email"])
            is_password_valid = await self.verify_password(customer_details["customer_password"], customer["customer_password"])
            
            if not is_password_valid:
                raise HTTPException(status_code=401, detail="password not matches")
            
            token = await self.create_access_token(data=customer, expires_delta=expiration_time)
            return {"token": token, "customer": customer}
           
        except Exception as e:
            raise e
        
    async def sign_up(self,db, customer_details):
        try:
            await self.customer_dal.create_customer(db=db, customer_details=customer_details)
            
        except Exception as e:
            raise e
            
        