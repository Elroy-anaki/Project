from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from models.device_customer import DeviceCustomer


from config.database import Base 

class Customer(Base):
    __tablename__ = "Customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(255))
    payment_details = Column(Text)
    contact_details = Column(Text)
    customer_password = Column(String(255))
    customer_email = Column(String(255))
    
    devices = relationship("DeviceCustomer", back_populates="customer")
    
    def to_json(self):
        return {
        "id": self.id,
            "customer_name": self.customer_name,
            "payment_details": self.payment_details,
            "contact_details": self.contact_details,
            "customer_email": self.customer_email,
            "customer_password": self.customer_password,
    }
