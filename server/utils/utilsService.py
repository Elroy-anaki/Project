from middleware.database_middleware import initial_data
import utils.alg as alg




class UtilsService:

    def predict_calibration_by_serial_number_and_input(self, serial_number: str,input_value: float):
        try:
            data = initial_data()
            return alg.calibration(data, serial_number, input_value)
        except Exception as e:
            raise e
        