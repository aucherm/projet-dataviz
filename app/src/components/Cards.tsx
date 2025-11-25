export function Cards() {
  return (
    <div id="cards" className="flex gap-4 mt-8 mr-20 ml-20">
        <p className="bg-white rounded-lg px-2 py-5">
          Tendances annuelles : Nombre de tournages par année pour repérer les
          pics d’activité.
        </p>
        <p className="bg-white rounded-lg px-2 py-5">
          Types de tournage : Long métrage, Série TV, Téléfilm… suivez l’évolution
          par type.
        </p>
        <p className="bg-white rounded-lg px-2 py-5">
          Graph des arrondissements : Répartition des tournages par arrondissement
          parisien.
        </p>
        <p className="bg-white rounded-lg px-2 py-5">
          Top réalisateurs : Classement des réalisateurs les plus présents à
          Paris.
        </p>
      </div>
  );
}