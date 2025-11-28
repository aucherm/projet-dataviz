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

interface apiResponce {
  count: number;
  results: Results[];
}

async function fetchApi(): Promise<apiResponce | undefined> {
  try {
    const api = await fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=100"
    );
    return api.json();
  } catch (error) {
    console.error(error);
  }
}

async function getFilmingByYear() {
  const data = await fetchApi();
  if (!data) return {};

  const counts: Record<string, number> = {};

  data.results.forEach((item) => {
    const annee = item.annee_tournage;
    counts[annee] = (counts[annee] || 0) + 1;
  });

  return counts;
}

export function FirstGraph() {
  const [data, setData] = useState<{ year: string; count: number }[]>([]);

  useEffect(() => {
    getFilmingByYear().then((counts) => {
      if (!counts) return;

      const formatted = Object.entries(counts).map(([year, count]) => ({
        year,
        count,
      }));

      formatted.sort((a, b) => Number(a.year) - Number(b.year));

      setData(formatted);
    });
  }, []);

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
