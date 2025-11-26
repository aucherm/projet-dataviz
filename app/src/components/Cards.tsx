import { useEffect, useState } from "react";

export function Cards() {
  const [total, setTotal] = useState<number | null>(null);
  const [avgPerYear, setAvgPerYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&rows=5000"
    )
      .then((res) => res.json())
      .then((data) => {
        setTotal(data.nhits);

        const yearsCount: Record<string, number> = {};
        data.records.forEach((r: any) => {
          const y = r.fields.annee_tournage;
          if (y) yearsCount[y] = (yearsCount[y] || 0) + 1;
        });

        const distinctYears = Object.keys(yearsCount).length;
        setAvgPerYear(distinctYears ? data.nhits / distinctYears : null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex gap-4 mt-8 mr-20 ml-27">
      <p className="bg-white rounded-lg px-4 py-5 w-72">
        <strong>Moyenne des tournages par an:</strong><br />
        {loading
          ? "Chargement..."
          : ` ${avgPerYear ? Math.round(avgPerYear) : "N/A"}`}
      </p>

      <p className="bg-white rounded-lg px-4 py-5 w-72">
        Types de tournage…
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
