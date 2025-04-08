from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

class DeviceCustomer(Base):
    __tablename__ = "DeviceCustomer"

    serial_number = Column(String(255), primary_key=True)
    device_name = Column(String(255))
    device_features = Column(Text)
    customer_id = Column(Integer, ForeignKey("Customers.id"))

    customer = relationship("Customer", back_populates="devices")
