from fastapi import Request
from fastapi.responses import JSONResponse
from middleware.database_middleware import initial_data
import utils.alg as alg



class UtilsService:

    def predict_calibration_by_serial_number_and_input(self, serial_number: str,input_value: float):
        try:
            data = initial_data()
            prediction = alg.calibration(data, serial_number, input_value, True)
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": prediction}
            )
        except Exception as e:
            raise e
        
    async def predict_uncertainty_by_serial_number(self, serial_number: str, request: Request):
        try:
            data = initial_data()
            print(data["identifier"])
            data_req = await request.json()
            identifier = data_req.get("identifier")
            query_date = data_req.get("query_date")
            query_value = data_req.get("query_value")
            print("---------")
            print(identifier, query_date, query_value)
            return 5
            uncertainty = alg.predict_uncertainty(data, serial_number, identifier, query_date, query_value)
            
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": uncertainty}
            )
        except Exception as e:
            raise e
        