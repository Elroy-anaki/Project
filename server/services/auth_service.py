from typing import Optional
import bcrypt 
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt

from fastapi import APIRouter, Request, Response, HTTPException


SECRET_KEY = "mysecretkey123"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  

class AuthService:

    async def hashPassword(self, password: str) -> bytes:
        salt = bcrypt.gensalt(10)
        hashedPassword = bcrypt.hashpw(password.encode(), salt)
        return hashedPassword
    
    async def verify_password(self, user_password: str, hashed_password: str):
        return bcrypt.checkpw(user_password.encode(), hashed_password.encode())
    
    async def create_access_token(self, data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=30)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        print("encoded_jwt", encoded_jwt)
        return encoded_jwt
    
    async def decode_access_token(self, token: str):
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if "exp" in payload and datetime.fromtimestamp(payload["exp"], tz=timezone.utc) < datetime.now(tz=timezone.utc):
                raise JWTError("Token expired")
            return payload
        except JWTError:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
    


    


