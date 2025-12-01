import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

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
  const arrayData = Object.entries(counts).map(([type, count]) => ({
    type,
    count,
  }));

  // trier par count décroissant
  arrayData.sort((a, b) => b.count - a.count);

  return arrayData;
}

interface SecondGraphProps {
  onData?: (data: { type: string; count: number }[]) => void;
}

export function SecondGraph({ onData }: SecondGraphProps) {
  const [data, setData] = useState<{ type: string; count: number }[]>([]);

  useEffect(() => {
    getFilmingByType().then((res) => {
      if (res) {
        setData(res);
        if (onData) onData(res); // 🔥 envoie les données au parent
      }
    });
  }, [onData]);

  return (
    <div style={{ width: "100%", height: 500 }}>
      {" "}
      {/* Hauteur fixe */}
      <h2
        style={{
          marginBottom: 20,
          color: "#282b12",
          textAlign: "center",
        }}
      >
        Répartition des types de tournages à Paris
      </h2>
      <ResponsiveContainer width="100%" height={500}>
        {" "}
        {/* Hauteur fixe */}
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 40, bottom: 60 }} // bottom réduit pour XAxis incliné
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
            height={60} // hauteur suffisante pour les labels inclinés
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
