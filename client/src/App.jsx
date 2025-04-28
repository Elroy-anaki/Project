import { useContext } from "react";
import { AddDeviceCustomer } from "./components/AddDeviceCustomer/AddDeviceCustomer";
import Dashboard from "./components/Dashboard/Dashboard";
import { Login } from "./components/Login/Login";
import { SingUp } from "./components/SignUp/SingUp";
import { NavBar } from "./components/ui/NavBar/NavBar";
import { Home } from "./pages/Home/Home";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import { AuthContext } from "./contexts/authContext";
import AddMeasurement from "./components/AddMeasurement/AddMeasurement";
import Prediction from "./components/Prediction/Prediction";
import Uncertainty from "./components/Uncertainty/Uncertainty";
import CalibrationInterval from "./components/CalibrationInterval/CalibrationInterval";
import WriteCalibrationCertificate from "./components/writeCalibrationCertificate/writeCalibrationCertificate";
import PredictNonexistent from "./components/PredictNonexistent/PredictNonexistent";
import CompareDeviationsUncertainties from "./components/CompareDeviationsUncertainties/CompareDeviationsUncertainties";

function Root() {
  return (
    <>
      <header className="h-[10vh] bg-gray-100">
        <NavBar />
      </header>
      <main className="bg-gray-100 min-h-[90vh]">
        <Outlet />

        {/* Modals */}
        <AddDeviceCustomer />
        <AddMeasurement />
        <Prediction />
        <Uncertainty />
        <CalibrationInterval />
        <WriteCalibrationCertificate />
        <PredictNonexistent />
        <CompareDeviationsUncertainties />
      </main>
    </>
  );
}

function App() {
  const { isAuth } = useContext(AuthContext);
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="sign-up" element={<SingUp />} />
          <Route path="login" element={<Login />} />
          <Route
            path="dashboard"
            element={isAuth ? <Dashboard /> : <Login />}
          />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
