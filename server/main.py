from fastapi import FastAPI
from routes.customer_routes import customer_router
from fastapi.middleware.cors import CORSMiddleware
from routes.device_customer_routes import device_customer_router
from routes.measurements_routes import measurements_router
from middleware.database_middleware import initial_data




app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(customer_router, prefix="/customers")
app.include_router(device_customer_router, prefix="/device-customers")
app.include_router(measurements_router, prefix="/measurements")

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}