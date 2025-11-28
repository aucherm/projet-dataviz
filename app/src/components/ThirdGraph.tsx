import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
} from "recharts";

interface Result {
  annee_tournage: string;
  type_tournage: string;
}

interface apiResponse {
  results: Result[];
  count: number;
}

const TOP_N_TYPES = 5;

async function fetchApi(): Promise<apiResponse | undefined> {
  try {
    const api = await fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=100"
    );
    return api.json();
  } catch (error) {
    console.error(error);
  }
}

export function ThirdGraph() {
  const [data, setData] = useState<any[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetchApi();
      if (!res) return;

      // Compter le nombre de tournages par type global
      const globalTypeCounts: Record<string, number> = {};
      res.results.forEach((r) => {
        const t = r.type_tournage || "Inconnu";
        globalTypeCounts[t] = (globalTypeCounts[t] || 0) + 1;
      });

      // Identifier les top N types
      const topTypes = Object.entries(globalTypeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, TOP_N_TYPES)
        .map(([type]) => type);

      setTypes(topTypes);

      // Regrouper par année et type
      const yearlyCounts: Record<string, Record<string, number>> = {};

      res.results.forEach((r) => {
        const year = r.annee_tournage;
        if (!yearlyCounts[year]) yearlyCounts[year] = {};
        const typeKey = topTypes.includes(r.type_tournage) ? r.type_tournage : "Autres";
        yearlyCounts[year][typeKey] = (yearlyCounts[year][typeKey] || 0) + 1;
      });

      // Transformer en tableau pour Recharts
      const chartData = Object.entries(yearlyCounts)
        .map(([year, counts]) => ({
          year,
          ...counts,
        }))
        .sort((a, b) => Number(a.year) - Number(b.year));

      setData(chartData);
    }

    loadData();
  }, []);

  const colors = ["#6A7330", "#A3A84F", "#D1D27B", "#8B5E3C", "#C2854A", "#B0B0B0"]; // dernière couleur = Autres

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Types × Année</h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          {types.concat("Autres").map((type, index) => (
            <Area
              key={type}
              type="monotone"
              dataKey={type}
              stackId="1"
              stroke={colors[index]}
              fill={colors[index]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
