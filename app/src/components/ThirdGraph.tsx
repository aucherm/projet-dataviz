import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ThirdGraph() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 🎨 Couleurs (5 types + Autres)
  const colors = [
    "#6a7330", // vert olive série web
    "#1a1b0d", // vert sapin série tv
    "#bdaea3", // beige téléfilm
    "#4f6138", // vert long métrage
    "#97775a", // marron 
    "#423b37", // taupe
  ]; 

  // --- FETCH ---
  function fetchData() {
    fetch(
      "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=100"
    )
      .then((r) => r.json())
      .then((json) => prepareData(json.results))
      .finally(() => setLoading(false));
  }

  // --- TRANSFORMATION ---
  function prepareData(results: any[]) {
    const counts: Record<string, Record<string, number>> = {};
    const typeTotals: Record<string, number> = {};

    results.forEach((item) => {
      const year = item.annee_tournage;
      const type = item.type_tournage;

      if (!year || !type) return;

      if (!counts[year]) counts[year] = {};
      counts[year][type] = (counts[year][type] || 0) + 1;

      typeTotals[type] = (typeTotals[type] || 0) + 1;
    });

    // top 5
    const topTypes = Object.entries(typeTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type]) => type);

    const years = Object.keys(counts).sort();

    const formatted = years.map((year) => {
      const row: any = { annee: year };
      let autres = 0;

      Object.entries(counts[year]).forEach(([type, value]) => {
        if (topTypes.includes(type)) row[type] = value;
        else autres += value;
      });

      row["Autres"] = autres;
      return row;
    });

    setCategories([...topTypes, "Autres"]);
    setChartData(formatted);
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Chargement…</p>;

  return (
    <div style={{ width: "100%", height: "400px" }}>
      <h2 style={{ marginBottom: 20 }}>
        Types de tournage x Année
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="annee" />
          <YAxis />
          <Tooltip />
          <Legend
          
           />

          {categories.map((cat, index) => (
            <Area
              key={cat}
              type="monotone"
              dataKey={cat}
              stackId="1"
              stroke={colors[index % colors.length]}
              fill={colors[index % colors.length]}
              
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
