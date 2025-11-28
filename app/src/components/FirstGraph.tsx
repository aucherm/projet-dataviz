import { useEffect, useState } from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
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

export default function FirstGraph({ onData }: {onData?: (data:YearCount []) => void }) {
  const [data, setData] = useState<YearCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    FetchFilming()
      .then(function (results) {
        const chartData = countFilmingByYear(results);
        setData(chartData);
        if (onData) {
          onData(chartData);
        }
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
      <h2 style={{ marginBottom: 20, color: "#282b12", textAlign: "center"}}>
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
