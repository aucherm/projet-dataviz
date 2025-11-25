import { useEffect, useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Line,
} from "recharts";

interface Result {
  annee_tournage: string;
}

interface ApiResponse {
  results: Result[];
}

interface YearCount {
  year: string;
  count: number;
}

function countFilmingByYear(results: Result[]): YearCount[] {
  const counts: { [year: string]: number } = {};

  for (const result of results) {
    const year = result.annee_tournage;
    if (year) {
      counts[year] = (counts[year] || 0) + 1;
    }
  }

  const chartData: YearCount[] = [];
  for (const year in counts) {
    if (counts.hasOwnProperty(year)) {
      chartData.push({ year, count: counts[year] });
    }
  }

  chartData.sort(function (a, b) {
    return Number(a.year) - Number(b.year);
  });

  return chartData;
}

function FetchFilming(): Promise<Result[]> {
  return fetch(
    "https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=100"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json: ApiResponse) {
      return json.results;
    });
}

export default function FirstGraph() {
  const [data, setData] = useState<YearCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    FetchFilming()
      .then(function (results) {
        const chartData = countFilmingByYear(results);
        setData(chartData);
      })
      .catch(function (error) {
        console.error("Erreur lors de la récupération des tournages:", error);
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des données...</p>;

  return (
    <div style={{ width: "100%", height: 600 }}>
      <h2 style={{ marginBottom: 20 }}>
        Évolution du nombre de tournages par année
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#4B5122"
            fill="#4B5122"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
