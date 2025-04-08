from fastapi import APIRouter, Depends, Request, Response, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from controllers.customer_controller import customer_controller
from middleware.database_middleware import get_db


customer_router = APIRouter()

@customer_router.get("/")
async def get_user_info():
    return {"msg": "get_user_info"}

@customer_router.post("/login")
async def login(request: Request,response: Response, db: Session = Depends(get_db)):
    try:
        print("route")
        return await customer_controller.login(request, response, db)
        
    except HTTPException as e:
        print(e)
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to process the login request.")
    
@customer_router.post("/sign-up")
async def sign_up(request: Request,db: Session = Depends(get_db)):
    try:
        return await customer_controller.sign_up(request,db)
        
    except HTTPException as e:
        print(e)
        raise e
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to process the sign_up request.")
    
    
@customer_router.get("/verify-token")
async def check_token(request: Request):
    print("Check Token")
    token = request.cookies.get("access_token")
    
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")

    customer_details = await customer_controller.customer_service.decode_access_token(token=token)
    return {"message": "Token exists", "data": customer_details, "success": True}


@customer_router.post("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,  
        samesite="None",
        path="/"
    )
    
    return response

    



