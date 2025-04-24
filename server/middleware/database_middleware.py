
from config import database
from models.measurements import Measurement
from utils.alg import preprocess_data
import pandas as pd



def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def initial_data():
    db = database.SessionLocal()
    measurements = db.query(Measurement).all()
    data = [m.to_json() for m in measurements]
    df = pd.DataFrame(data)
    
    return preprocess_data(df)


