import { useEffect, useState } from "react";

export function Cards() {
  const [total, setTotal] = useState<number | null>(null);
  const [avgPerYear, setAvgPerYear] = useState<number | null>(null);
  const [mostFrequentType, setMostFrequentType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(
          "https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&rows=5000"
        );
        const data = await res.json();

        // Total global
        setTotal(data.nhits);

        // Regroupement par année pour la moyenne
        const yearsCount: Record<string, number> = {};
        const typeCount: Record<string, number> = {};

        data.records.forEach((record: any) => {
          const year = record.fields.annee_tournage;
          const type = record.fields.type_tournage;

          if (year) yearsCount[year] = (yearsCount[year] || 0) + 1;
          if (type) typeCount[type] = (typeCount[type] || 0) + 1;
        });

        // Calcul moyenne par année
        const distinctYears = Object.keys(yearsCount).length;
        setAvgPerYear(distinctYears ? data.nhits / distinctYears : null);

        // Type de tournage le plus fréquent
        const sortedTypes = Object.entries(typeCount).sort((a, b) => b[1] - a[1]);
        setMostFrequentType(sortedTypes.length ? sortedTypes[0][0] : null);

      } catch (e) {
        console.error("Erreur API :", e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="flex gap-4 mt-8 mr-20 ml-20">
      <p className="bg-white rounded-lg px-4 py-5 w-72">
        <strong>Nombre de tournages en moyenne depuis 2016 :</strong><br />
        {loading
          ? "Chargement..."
          : `${avgPerYear ? Math.round(avgPerYear) : "N/A"}`}
      </p>

      <p className="bg-white rounded-lg px-4 py-5 w-72">
        <strong>Type de tournage le plus fréquent :</strong><br />
        {loading
          ? "Chargement..."
          : `${mostFrequentType || "N/A"}`}
      </p>

      <p className="bg-white rounded-lg px-4 py-5 w-72">
        Graph des arrondissements…
      </p>

      <p className="bg-white rounded-lg px-4 py-5 w-72">
        Top réalisateurs…
      </p>
    </div>
  );
}
