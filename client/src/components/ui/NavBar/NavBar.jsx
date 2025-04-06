import { Link } from "react-router-dom";



export function NavBar() {


    return (
        <>

        <nav className="bg-cyan-700">
            <ul className="py-2 flex justify-between items-center px-5">
                <div>
                <li>
                    <Link to={"home"}>
                    <p className="text-white text-xl font-bold">CalibraPro</p>

                    </Link>
                </li>

                </div>
                <div className="flex justify-between items-center gap-5">
                <li>
                <Link to={"login"}>
                    <p className="text-white text-lg font-semibold">Login</p>
                    </Link>
                </li>
                <li>
                    <Link to={"sign-up"}>
                    <p className="text-white text-lg font-semibold">Sign Up</p>
                    </Link>
                </li>

                </div>
            </ul>
        </nav>
        </>
    )
}