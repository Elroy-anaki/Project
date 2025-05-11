import os
from fastapi import Request
from fastapi.responses import JSONResponse
from middleware.database_middleware import initial_data
from dal.device_customer_dal import DeviceCustomerDal
import utils.alg as alg
import json



def format_dict_to_string(data: dict) -> str:
    return ", ".join(f"{key} - {value}" for key, value in data.items())
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
            print(data)
            data_req = await request.json()
            identifier = data_req.get("identifier")
            query_date = data_req.get("query_date")
            query_value = data_req.get("query_value")
            uncertainty = alg.predict_uncertainty(data, serial_number, identifier, query_date, query_value)
            
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": uncertainty}
            )
        except Exception as e:
            raise e
        
        
    async def find_calibration_interval(self, serial_number:str,  request: Request):
        try:
            data = initial_data()
            data_req = await request.json()
            identifier = data_req.get("identifier")
            risk_factor = data_req.get("risk_factor")
            print("alg")
            calibaration_interval = alg.find_calibration_interval(data, serial_number, identifier, risk_factor)
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": calibaration_interval}
            )
        except Exception as e:
            raise e
        
    async def write_calibration_certificate(self, serial_number:str,  request: Request):
        try:
            data = initial_data()
            data_req = await request.json()
            identifier = data_req.get("identifier")
            res = alg.write_calibration_certificate(data, serial_number, identifier)
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": res}
            )
        except Exception as e:
            raise e
        
    async def predict_for_nonexisting_input(self, serial_number:str,  request: Request):
        try:
            print("none....")
            data = initial_data()
            data_req = await request.json()
            identifier = data_req.get("identifier")
            query_date = data_req.get("query_date")
            query_value = data_req.get("query_value")
            res = alg.predict_for_nonexistent_input_value(data, serial_number, identifier, query_date, query_value, to_plot=True)
            
            return JSONResponse(
                status_code=200,
                content={"success": True, "data": res}
            )
        except Exception as e:
            raise e
        
        
    async def compare_deviations_uncertainties(self, serial_number:str,  request: Request):
        try:
            data = initial_data()
            data_req = await request.json()
            identifier = data_req.get("identifier")
            res = alg.compare_deviations_uncertainties(data, serial_number, identifier)
            print(res)
            return JSONResponse(
                status_code=200,
                content={"success": True, "data":  res})
        except Exception as e:
            raise e
        
    async def percentage_pass_deviation_uncertainty_validation(self, serial_number:str,  request: Request):
        try:
            data = initial_data()
            data_req = await request.json()
            identifier = data_req.get("identifier")
            res = alg.percentage_pass_deviation_uncertainty_validation(data, serial_number, identifier)
            print("res", res)
            return JSONResponse(
                status_code=200,
                content={"success": True, "data":  res})
        except Exception as e:
            raise e
        
        
        
        
    async def summarize_input_values(self):
        try:
            data = initial_data()
            res = alg.summarize_input_values(data)
            res = res.reset_index().to_dict(orient="records")
            return JSONResponse(
                    status_code=200,
                    content={"success": False, "data":  res})
        except Exception as e:
            raise e
        
        
    async def upload_file(self, pdf, db, customer_id):
        try:
            file_location = "תעודת כיול.pdf"
            
            with open(file_location, "wb") as f:
                f.write(await pdf.read())
        
            res = alg.extract_certificate_data(file_location, "output.json")

            print("ressssss", res["measurements"])
            print(res["first_page"]["Instrument"])
            print(res["first_page"]["Serial Number"])
            features = format_dict_to_string(res["second_page"])
            print(features)
            device_customer_details = {
                "serial_number": res["first_page"]["Serial Number"], 
                "device_name": res["first_page"]["Instrument"],
                "device_features": features,
                "customer_id": customer_id
            }
            print("device_customer_details", device_customer_details)
            print("customer_id", type(customer_id))
            Device_customer_dal = DeviceCustomerDal(db)
            
            # בדיקה אם המכשיר קיים
            existing_device = await Device_customer_dal.get_device_by_serial_number(device_customer_details["serial_number"])
            
            if existing_device:
                os.remove(file_location)
                return JSONResponse(
                    status_code=200,
                    content={"success": False, "data":  res}
                )
            else:
                # אם המכשיר לא קיים, יוצרים אותו
                new_device = await Device_customer_dal.create_device_customer(device_customer_details)
                os.remove(file_location)
                return JSONResponse(
                    status_code=200,
                   content={"success": False, "data":  res}
                )
        except Exception as e:
            raise e
        
        