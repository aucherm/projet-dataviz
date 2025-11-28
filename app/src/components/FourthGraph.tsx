import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";

interface Props {
  ardt_lieu: string;
}

interface ApiResponse {
  results: Props[];
}

async function fetchApi(): Promise<ApiResponse | undefined> {
  try {
    const api = await fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=100"
    );
    return api.json();
  } catch (error) {
    console.error(error);
  }
}

function countByArrondissement(items: Props[]) {
  return items.reduce((acc, item) => {
    const ardt = item.ardt_lieu;
    acc[ardt] = (acc[ardt] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

export function FourthGraph() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await fetchApi();
      setData(result ?? null);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Chargement…</p>;

  // Comptage et transformation en tableau
  const counts = countByArrondissement(data!.results);
  const chartData = Object.entries(counts)
    .map(([ardt, count]) => ({ ardt, count }))
    .sort((a, b) => b.count - a.count); // tri décroissant

  // Couleurs alternées
  const colors = ["#6A7330", "#1A1B0D"];

  return (
    <div style={{ width: "100%", height: 600 }}>
      <h2 style={{ marginBottom: 20, color: "#282b12", textAlign: "center"}}>
        Tournages par arrondissement
      </h2>
    <ResponsiveContainer width="100%" height={400}>
      

      <BarChart
        width={900}
        height={400}
        data={chartData}
        layout="horizontal" // barres verticales
        margin={{ left: 40, right: 40, top: 20, bottom: 50 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="category" dataKey="ardt" />
        <YAxis type="number" />
        <Tooltip />

        <Bar dataKey="count">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
          <LabelList dataKey="count" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
