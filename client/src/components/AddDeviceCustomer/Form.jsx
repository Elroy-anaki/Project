import React from "react";
import { Input } from "../ui/Input/Input";

function Form({ onChange }) {
  return (
    <>
      <div className="space-y-3">
        <div>
          <Input
            placeholder="Serial Number"
            name="serial_number"
            id="serial_number"
            type="text"
            onChange={onChange}
          />
        </div>
        <div>
          <Input
            placeholder="Device Name"
            name="device_name"
            id="device_name"
            type="text"
            onChange={onChange}
          />
        </div>
        <div>
          <Input
            placeholder="Device Features"
            name="device_features"
            id="device_features"
            type="text"
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}

export default Form;
