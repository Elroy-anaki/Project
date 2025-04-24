from fastapi.responses import JSONResponse
from middleware.database_middleware import initial_data
import utils.alg as alg




class UtilsService:

    def predict_calibration_by_serial_number_and_input(self, serial_number: str,input_value: float):
        try:
            data = initial_data()
            print("Data proccesed....")
            prediction = alg.calibration(data, serial_number, input_value)
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": prediction}
            )
        except Exception as e:
            raise e
        