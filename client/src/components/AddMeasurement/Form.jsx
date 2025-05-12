// תיקון לקובץ Form.js
// יש להוסיף state לוקאלי לטופס שיתאפס כשהטופס נסגר

import React, { useContext, useState, useEffect } from "react";
import { Input } from "../ui/Input/Input";
import { SharedContext } from "../../contexts/sharedContext";

function parseToNumber(value) {
  if (typeof value !== "string") return NaN;
  value = value.trim();
  if (value.endsWith("-")) {
    value = "-" + value.slice(0, -1);
  }
  value = value.replace(/[^0-9.\-]/g, "");
  return parseFloat(value);
}

function validateUnit(value) {
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

function Form({ serialNumber, onChange, formKey }) {
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
    measurement_date: '',
    unit1: '',
    unit2: '',
    unit3: '',
    threshold: '',
    identifier: '',
    status: '',
    comments: '',
    tolerance: '',
    uncertainty: ''
  });
  
  // איפוס הערכים כשמשתנה ה-formKey
  useEffect(() => {
    setFormValues({
      input_value: '',
      output_value: '',
      deviation: '',
      measurement_date: '',
      unit1: '',
      unit2: '',
      unit3: '',
      threshold: '',
      identifier: '',
      status: '',
      comments: '',
      tolerance: '',
      uncertainty: ''
    });
  }, [formKey]);

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
    
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    onChange(e);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    
    if (!validateDate(value)) {
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

    if (name === 'input_value' || name === 'output_value') {
      const input = name === 'input_value' ? parseToNumber(value) : parseToNumber(formValues.input_value);
      const output = name === 'output_value' ? parseToNumber(value) : parseToNumber(formValues.output_value);
      
      if (!isNaN(input) && !isNaN(output)) {
        const deviation = output - input;
        setFormValues(prev => ({
          ...prev,
          deviation: deviation.toString()
        }));
        
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

  // שימוש ב-mesToAdd רק אם יש ערכים ו-counterMes תקין
  const getMesToAddValue = (field, fallback = "") => {
    if (mesToAdd?.length && counterMes < mesToAdd.length && mesToAdd[counterMes] && mesToAdd[counterMes][field]) {
      return mesToAdd[counterMes][field].value;
    }
    return formValues[fallback] || fallback;
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
              value={getMesToAddValue("Nominal torque") || formValues.input_value}
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
              value={getMesToAddValue("Applied torque") || formValues.output_value}
            />
          </div>
          <div>
            <Input
              id={"unit1"}
              name={"unit1"}
              placeholder={"Unit1"}
              type={"text"}
              onChange={handleUnitChange}
              value={formValues.unit1}
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
              value={getMesToAddValue("Deviation", "deviation") || formValues.deviation}
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
              onChange={handleInputChange}
              value={getMesToAddValue("Permissible deviation") || formValues.tolerance}
            />
          </div>
          <div>
            <Input
              id={"unit2"}
              name={"unit2"}
              placeholder={"Unit2"}
              type={"text"}
              onChange={handleUnitChange}
              value={formValues.unit2}
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
              onChange={handleInputChange}
              value={getMesToAddValue("Uncertainty") || formValues.uncertainty}
            />
          </div>
          <div>
            <Input
              id={"unit3"}
              name={"unit3"}
              placeholder={"Unit3"}
              type={"text"}
              onChange={handleUnitChange}
              value={formValues.unit3}
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
              onChange={handleInputChange}
              value={getMesToAddValue("Permissible deviation") || formValues.threshold}
            />
          </div>
        </div>
        <div>
          <Input
            id={"identifier"}
            name={"identifier"}
            placeholder={"Identifier"}
            type={"text"}
            onChange={handleInputChange}
            value={formValues.identifier}
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
            onChange={handleInputChange}
            value={formValues.status}
          />
        </div>
        <Input
          id={"comments"}
          name={"comments"}
          placeholder={"Comments"}
          type={"text"}
          onChange={handleInputChange}
          value={getMesToAddValue("comments") || formValues.comments}
        />
      </div>
    </>
  );
}

export default Form;