from sqlalchemy.orm import Session
from models.customer import Customer


class CustomerDal:
        
    async def get_customer_by_id(self, db: Session,customer_id: str):
        try:
            customer = await db.query(Customer).get(customer_id)
            return customer
        except Exception as e:
            raise e
        
    async def get_customer_by_email(self, db: Session, customer_email):
        try:
            customer = db.query(Customer).filter_by(customer_email=customer_email).first().to_json()
            return customer
        except Exception as e:
            raise e
        
    async def create_customer(self, db: Session, customer_details: dict):
        try:
            new_customer = Customer(customer_name=customer_details["customer_name"], 
                                  payment_details=None,
                                  contact_details=None,
                                  customer_password=customer_details["customer_password"],
                                  customer_email=customer_details["customer_email"])
            db.add(new_customer)
            print("ADD")
            db.commit()
            print("Commit")
            db.refresh(new_customer)
            return new_customer
        except Exception as e:
            raise e

    
