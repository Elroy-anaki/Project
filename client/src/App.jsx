import { useContext } from "react";
import { AddDeviceCustomer } from "./components/AddDeviceCustomer/AddDeviceCustomer";
import Dashboard from "./components/Dashboard/Dashboard";
import { Login } from "./components/Login/Login";
import { SingUp } from "./components/SignUp/SingUp";
import { NavBar } from "./components/ui/NavBar/NavBar";
import { Home } from "./pages/Home/Home";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Outlet } from "react-router-dom";
import { AuthContext } from "./contexts/authContext";
import AddMeasurement from "./components/AddMeasurement/AddMeasurement";

function Root() {
  return (
    <>
      <header className="h-[10vh] bg-gray-100">
        <NavBar />
      </header>
      <main className="bg-gray-100 min-h-[90vh]">
        <Outlet />

        <AddDeviceCustomer />
        <AddMeasurement />
      </main>
    </>
  );
}

function App() {
  const {isAuth} = useContext(AuthContext)
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />}/>
          <Route path="home" element={<Home />} />
          <Route path="sign-up" element={<SingUp />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={isAuth ? <Dashboard />: <Login />} />
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
