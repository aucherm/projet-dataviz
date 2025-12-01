import { NavLink } from "react-router";

export function Main() {
  return (
    <main className="bg-white/60 max-w-7xl mx-auto text-center px-6 sm:px-10 md:px-20 py-10 md:py-20 rounded-md text-black">
      <h1 className="font-bold text-3xl sm:text-4xl">
        Paris Movie Tracker
      </h1>

      <p className="font-bold px-2 sm:px-6 md:px-10 py-6 text-sm sm:text-base">
        Explorez Paris comme si vous traquiez des tournages : quels films ont envahi quel quartier, en quelle année, avec quels réalisateurs… bref, tout ce qu’il faut pour jouer au détective du cinéma.  
        Plongez dans la jungle du cinéma parisien : années, genres, arrondissements, réalisateurs… tout y passe, sauf le popcorn.
      </p>

      <NavLink
        to="/Analyse"
        className="font-semibold px-4 py-2 rounded-lg bg-white hover:bg-black hover:text-white inline-block mt-4 transition"
      >
        Explorer les analyses
      </NavLink>
    </main>
  );
}
