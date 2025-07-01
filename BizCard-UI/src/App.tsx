import { NavLink } from "react-router";
import logo from "./assets/logo.svg";

function App() {
  return (
    <>
      <header className="flex justify-between items-center m-2 mx-4">
        <img className="w-20" src={logo} />
        <nav className="flex gap-4 items-center">
          <NavLink to={"/auth?type=signup"} className="text-[hsl(0,0%,10%)] hover:text-[hsl(0,0%,0%)] transition-colors">
            Login
          </NavLink>
          <NavLink to={'/auth?type=signup'} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors">
            Sign Up
          </NavLink>
        </nav>
      </header>
    </>
  );
}

export default App;
