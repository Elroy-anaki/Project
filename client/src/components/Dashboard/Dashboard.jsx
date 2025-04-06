import React from "react";
import { Table } from "../Table/Table";

function Dashboard() {
  return (
    <>
      <div className="mx-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold ">Choose a Device</h3>
        <button className="text-white px-3 py-1.5 bg-cyan-700 font-semibold rounded-lg">Add New Device +</button>

      </div>
        <Table />
      </div>
    </>
  );
}

export default Dashboard;
