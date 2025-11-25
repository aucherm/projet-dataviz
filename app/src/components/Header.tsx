import { NavLink } from "react-router";

export function Header() {
  return (
    <header className=" text-black px-10 py-4 gap-10 mx-auto">
      <nav className="w-full px-8 py-4 flex items-center gap-6">
        <NavLink
          to="/"
          className="{({ isActive }) =>
      ` px-4 py-2 rounded-full bg-white hover:bg-black hover:text-white"
        >
          Accueil
        </NavLink>

        <NavLink
          to="/Analyse"
          className="{({ isActive }) =>
      ` px-4 py-2 rounded-full bg-white hover:bg-black hover:text-white"
        >
          Analyse
        </NavLink>
      </nav>
    </header>
  );
}
