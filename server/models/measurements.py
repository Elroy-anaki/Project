
from sqlalchemy import Column, String, Date, DECIMAL, Text, Integer
from sqlalchemy.orm import relationship
from config.database import Base
from sqlalchemy.dialects.mysql import TINYINT
import uuid



class Measurement(Base):
    
    __tablename__ = "Measurements"

    measurement_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    serial_number = Column(String(50), nullable=False)
    measurement_date = Column(Date, nullable=False)

    input_value = Column(DECIMAL(10, 4), nullable=False)
    output_value = Column(DECIMAL(10, 4), nullable=False)
    unit1 = Column(String(50), nullable=False)

    deviation = Column(DECIMAL(10, 4), nullable=False)
    tolerance = Column(DECIMAL(10, 4), nullable=False)
    unit2 = Column(String(50), nullable=False)

    uncertainty = Column(DECIMAL(10, 4), nullable=False)
    unit3 = Column(String(50), nullable=False)

    threshold = Column(DECIMAL(10, 4), nullable=False)
    identifier = Column(String(255), nullable=False)
    status = Column(TINYINT(1), nullable=False)

    comments = Column(Text, nullable=True)
    
    
    def to_json(self):
        return {
            "measurement_id": self.measurement_id,
            "serial_number": self.serial_number,
            "measurement_date": self.measurement_date.isoformat() if self.measurement_date else None,
            "input_value": str(self.input_value) if self.input_value else None,
            "output_value": str(self.output_value) if self.output_value else None,
            "unit1": self.unit1,
            "deviation": str(self.deviation) if self.deviation else None,
            "tolerance": str(self.tolerance) if self.tolerance else None,
            "unit2": self.unit2,
            "uncertainty": str(self.uncertainty) if self.uncertainty else None,
            "unit3": self.unit3,
            "threshold": str(self.threshold) if self.threshold else None,
            "identifier": self.identifier,
            "status": self.status,
            "comments": self.comments,
        }
