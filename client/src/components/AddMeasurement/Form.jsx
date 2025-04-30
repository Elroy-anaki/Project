import React, { useContext } from "react";
import { Input } from "../ui/Input/Input";
import { SharedContext } from "../../contexts/sharedContext";

function Form({ serialNumber, onChange }) {
  const {mesToAdd, setMesToAdd} = useContext(SharedContext)
  console.log(mesToAdd)
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
              value={mesToAdd && mesToAdd["Nominal torque"] ? mesToAdd["Nominal torque"].value : ""}

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
              value={mesToAdd && mesToAdd["Applied torque"] ? mesToAdd["Applied torque"].value : ""}
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
              value={mesToAdd && mesToAdd["Permissible deviation"] ? mesToAdd["Permissible deviation"].value : ""}
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
              value={mesToAdd && mesToAdd["Permissible deviation"] ? mesToAdd["Permissible deviation"].value : ""}
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
            value={mesToAdd && mesToAdd["Uncertainty"] ? mesToAdd["Uncertainty"].value : ""}
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
            value={mesToAdd && mesToAdd["Permissible deviation"] ? mesToAdd["Permissible deviation"].value : ""}
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
          value={mesToAdd && mesToAdd["comments"] ? mesToAdd["comments"].value : ""}
        />
      </div>
    </>
  );
}

export default Form;
