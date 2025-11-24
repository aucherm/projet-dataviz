import { NavLink } from "react-router";

export function Header() {
  return (
    <header>
      <NavLink to="/">Accueil</NavLink>
      <NavLink to="/Analyse">Analyse</NavLink>
    </header>
  );
}
