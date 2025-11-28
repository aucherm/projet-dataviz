import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Results {
  annee_tournage: string;
}

interface apiResponse {
  count: number;
  results: Results[];
}

/* ------------------------------
   FETCH ALL DATA WITH PAGINATION
---------------------------------*/
async function fetchAllData(): Promise<Results[]> {
  const limit = 100;
  let offset = 0;
  let allResults: Results[] = [];

  while (true) {
    const url = `https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(url);
      const json: apiResponse = await response.json();

      if (!json.results || json.results.length === 0) {
        break; // Fin de la pagination
      }

      allResults = [...allResults, ...json.results];
      offset += limit;
    } catch (error) {
      console.error("Erreur lors du fetch:", error);
      break;
    }
  }

  return allResults;
}

/* ------------------------------
   GROUP BY YEAR
---------------------------------*/
async function getFilmingByYear() {
  const allData = await fetchAllData();
  const counts: Record<string, number> = {};

  allData.forEach((item) => {
    const year = item.annee_tournage;
    if (!year) return;

    counts[year] = (counts[year] || 0) + 1;
  });

  return counts;
}

/* ------------------------------
   RECHARTS COMPONENT
---------------------------------*/
export function FirstGraph() {
  const [data, setData] = useState<{ year: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFilmingByYear().then((counts) => {
      if (!counts) return;

      const formatted = Object.entries(counts)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => Number(a.year) - Number(b.year));

      setData(formatted);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Chargement des données… (≈14 000 lignes)</p>;

  return (
    <div style={{ width: "100%", height: 600 }}>
      <h2 style={{ marginBottom: 20, color: "#282b12", textAlign: "center" }}>
        Évolution du nombre de tournages par année
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="myGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#6A7330" />
              <stop offset="100%" stopColor="#1A1B0D" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="count"
            stroke="#1a1b0d"
            fill="url(#myGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
