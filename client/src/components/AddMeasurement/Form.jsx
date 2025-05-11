import React, { useContext, useState, useEffect } from "react";
import { Input } from "../ui/Input/Input";
import { SharedContext } from "../../contexts/sharedContext";

function parseToNumber(value) {
  if (typeof value !== "string") return NaN;

  // הזזת סימן שלילי לסוף
  value = value.trim();

  // אם הסימן השלילי נמצא בסוף המחרוזת (כמו '5.75-')
  if (value.endsWith("-")) {
    value = "-" + value.slice(0, -1);
  }

  // הסרה של תווים לא חוקיים כמו '%' או תווים נוספים
  value = value.replace(/[^0-9.\-]/g, "");

  return parseFloat(value);
}

function validateUnit(value) {
  // בדיקה שהערך מכיל רק אותיות באנגלית
  const englishRegex = /^[a-zA-Z]+$/;
  return englishRegex.test(value);
}

function validateDate(date) {
  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear() - 50, 0, 1);
  const maxDate = new Date(currentDate.getFullYear() + 50, 11, 31);
  const inputDate = new Date(date);
  
  return inputDate >= minDate && inputDate <= maxDate;
}

function Form({ serialNumber, onChange }) {
  const {mesToAdd, counterMes} = useContext(SharedContext);
  const [unitErrors, setUnitErrors] = useState({
    unit1: '',
    unit2: '',
    unit3: ''
  });

  const [formValues, setFormValues] = useState({
    input_value: '',
    output_value: '',
    deviation: '',
    measurement_date: ''
  });

  const handleUnitChange = (e) => {
    const { name, value } = e.target;
    
    if (!validateUnit(value)) {
      setUnitErrors(prev => ({
        ...prev,
        [name]: 'נא להזין רק אותיות באנגלית'
      }));
    } else {
      setUnitErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    onChange(e);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    if (!validateDate(value)) {
      // אם התאריך לא תקין, נחזיר לערך הקודם
      e.target.value = formValues.measurement_date;
      return;
    }
    
    setFormValues(prev => ({
      ...prev,
      measurement_date: value
    }));
    
    onChange(e);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // אם זה input או output, נחשב את ה-deviation
    if (name === 'input_value' || name === 'output_value') {
      const input = name === 'input_value' ? parseToNumber(value) : parseToNumber(formValues.input_value);
      const output = name === 'output_value' ? parseToNumber(value) : parseToNumber(formValues.output_value);
      
      if (!isNaN(input) && !isNaN(output)) {
        const deviation = output - input;
        setFormValues(prev => ({
          ...prev,
          deviation: deviation.toString()
        }));
        
        // יצירת אירוע מלאכותי עבור ה-deviation
        const deviationEvent = {
          target: {
            name: 'deviation',
            value: deviation.toString()
          }
        };
        onChange(deviationEvent);
      }
    }

    onChange(e);
  };

  return (
    <>
      <div className="space-y-3">
        <div className="">
          <Input
            id={"measurement_date"}
            name={"measurement_date"}
            placeholder={"Measurement Date"}
            type={"date"}
            onChange={handleDateChange}
            value={formValues.measurement_date}
          />
        </div>
        <div className="flex justify-center items-center">
          <div>
            <Input
              type={"number"}
              step={"any"}
              name={"input_value"}
              id={"input_value"}
              placeholder={"Input"}
              onChange={handleInputChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Nominal torque"] ? mesToAdd[counterMes]["Nominal torque"].value : ""}
            />
          </div>
          <div>
            <Input
              type={"number"}
              step={"any"}
              name={"output_value"}
              id={"output_value"}
              placeholder={"Output"}
              onChange={handleInputChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Applied torque"] ? mesToAdd[counterMes]["Applied torque"].value : ""}
            />
          </div>
          <div>
            <Input
              id={"unit1"}
              name={"unit1"}
              placeholder={"Unit1"}
              type={"text"}
              onChange={handleUnitChange}
            />
            {unitErrors.unit1 && (
              <p className="text-red-500 text-sm text-right mr-8">{unitErrors.unit1}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <Input
              type={"number"}
              step={"any"}
              name={"deviation"}
              id={"deviation"}
              placeholder={"Deviation"}
              onChange={onChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Deviation"] ? parseToNumber(mesToAdd[counterMes]["Deviation"].value) : formValues.deviation}
              readOnly
            />
          </div>
          <div>
            <Input
              type={"number"}
              step={"any"}
              name={"tolerance"}
              id={"tolerance"}
              placeholder={"Tolerance"}
              onChange={onChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Permissible deviation"] ? mesToAdd[counterMes]["Permissible deviation"].value : ""}
            />
          </div>
          <div>
            <Input
              id={"unit2"}
              name={"unit2"}
              placeholder={"Unit2"}
              type={"text"}
              onChange={handleUnitChange}
            />
            {unitErrors.unit2 && (
              <p className="text-red-500 text-sm text-right mr-8">{unitErrors.unit2}</p>
            )}
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <Input
              type={"number"}
              step={"any"}
              name={"uncertainty"}
              id={"uncertainty"}
              placeholder={"Uncertainty"}
              onChange={onChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Uncertainty"] ? mesToAdd[counterMes]["Uncertainty"].value : ""}
            />
          </div>
          <div>
            <Input
              id={"unit3"}
              name={"unit3"}
              placeholder={"Unit3"}
              type={"text"}
              onChange={handleUnitChange}
            />
            {unitErrors.unit3 && (
              <p className="text-red-500 text-sm text-right mr-8">{unitErrors.unit3}</p>
            )}
          </div>
          <div>
            <Input
              type={"number"}
              step={"any"}
              name={"threshold"}
              id={"threshold"}
              placeholder={"Threshold"}
              onChange={onChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Permissible deviation"] ? mesToAdd[counterMes]["Permissible deviation"].value : ""}
            />
          </div>
        </div>
        <div>
          <Input
            id={"identifier"}
            name={"identifier"}
            placeholder={"Identifier"}
            type={"text"}
            onChange={onChange}
          />
        </div>
        <div>
          <Input
            type={"number"}
            min={0}
            max={1}
            name={"status"}
            id={"status"}
            placeholder={"Status"}
            onChange={onChange}
          />
        </div>
        <Input
          id={"comments"}
          name={"comments"}
          placeholder={"Comments"}
          type={"text"}
          onChange={onChange}
          value={mesToAdd?.length && mesToAdd[counterMes]["comments"] ? mesToAdd[counterMes]["comments"].value : ""}
        />
      </div>
    </>
  );
}

export default Form;
