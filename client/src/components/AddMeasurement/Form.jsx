import React, { useContext } from "react";
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


function Form({ serialNumber, onChange }) {
  const {mesToAdd, setMesToAdd, counterMes,} = useContext(SharedContext)
  console.log(mesToAdd)
  if(mesToAdd?.length > 0) {
    console.log(mesToAdd[counterMes])

  }
  return (
    <>
      <div className="space-y-3">

        <div className="">
          <Input
            id={"measurement_date"}
            name={"measurement_date"}
            placeholder={"Measurement Date"}
            type={"date"}
            onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              value={mesToAdd?.length && mesToAdd[counterMes]["Applied torque"] ? mesToAdd[counterMes]["Applied torque"].value : ""}
              />
          </div>
          <div>
            <Input
              id={"unit1"}
              name={"unit1"}
              placeholder={"Unit1"}
              type={"text"}
              onChange={onChange}
            />
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
              value={mesToAdd?.length && mesToAdd[counterMes]["Deviation"] ? parseToNumber(mesToAdd[counterMes]["Deviation"].value) : ""}
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
              onChange={onChange}
              />
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
            onChange={onChange}
            />
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
