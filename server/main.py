from fastapi import FastAPI
from routes.customer_routes import customer_router
from fastapi.middleware.cors import CORSMiddleware




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

@app.get("/")
def read_root():
    return {"message": "Hello FastAPI"}