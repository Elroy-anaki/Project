import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/authContext";

export function NavBar() {
  const { customer, logOut  } = useContext(AuthContext);
  return (
    <nav className="bg-cyan-700">
      <ul className="py-2 flex justify-between items-center px-5">
        <li>
          <Link to="home">
            <p className="text-white text-xl font-bold">CalibraPro</p>
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <p className="text-white text-xl font-bold">Dashboard</p>
          </Link>
        </li>
        <div className="flex justify-between items-center gap-5">
          {customer ? (
            <>
              <li>
                <p className="text-white text-lg font-semibold">{customer.customer_name}</p>
              </li>
              <li onClick={() => logOut()}>
                <Link to="/">
                  <p className="text-white text-lg font-semibold bg-rose-600 px-2 py-1 rounded-lg">Logout</p>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="login">
                  <p className="text-white text-lg font-semibold">Login</p>
                </Link>
              </li>
              <li>
                <Link to="sign-up">
                  <p className="text-white text-lg font-semibold">Sign Up</p>
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}
