import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/authContext";

export function NavBar() {
  const { customer, logOut } = useContext(AuthContext);
  return (
    <nav className="bg-gradient-to-r from-cyan-700 to-cyan-800 shadow-lg">
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="home" className="flex items-center">
              <img src="/logo.png" alt="logo" className="h-20 w-auto hover:scale-105 transition-transform duration-300" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-white hover:text-cyan-200 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-300">
              Dashboard
            </Link>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {customer ? (
                <>
                  <span className="text-white text-lg font-medium bg-cyan-600/30 px-4 py-2 rounded-full">
                    {customer.customer_name}
                  </span>
                  <button
                    onClick={() => logOut()}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="login"
                    className="text-white hover:text-cyan-200 px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="sign-up"
                    className="bg-white text-cyan-700 hover:bg-cyan-100 px-4 py-2 rounded-lg text-lg font-medium transition-colors duration-300"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
