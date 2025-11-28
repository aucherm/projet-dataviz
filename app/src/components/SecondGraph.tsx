import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts";

interface Result {
  type_tournage: string;
}

interface apiResponce {
  count: number;
  results: Result[];
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

async function getFilmingByType() {
  const data = await fetchApi();
  if (!data) return [];

  const counts: Record<string, number> = {};

  data.results.forEach((item) => {
    const type = item.type_tournage || "Inconnu";
    counts[type] = (counts[type] || 0) + 1;
  });

  // transformer en tableau pour Recharts
  return Object.entries(counts).map(([type, count]) => ({ type, count }));
}

export function SecondGraph() {
  const [data, setData] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    getFilmingByType().then((res) => {
      if (res) setData(res);
    });
  }, []);

  return (
    <div style={{ width: "100%", height: 600 }}>
      <h2 style={{ marginBottom: 20, color: "#282b12", textAlign: "center"}}>
        Répartition des types de tournages à Paris
      </h2>

      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 80 }}
        >
          <defs>
            <linearGradient id="myGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="50%" stopColor="#6A7330" />
              <stop offset="100%" stopColor="#1A1B0D" />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="type"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />

          <YAxis />

          <Tooltip />
          <Legend />

          <Bar dataKey="count" fill="url(#myGradient)">
            <LabelList position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
