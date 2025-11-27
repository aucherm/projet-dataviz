/*
1. Définir le type de données attendu
2. Créer un état pour stocker les données
3. Récupérer les tournages depuis l'API
4. Compter et calculer le opurcentage par type
5. Mettre à jour l'état
6. Afficher le graphique à barres pour recharts
*/

import { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import { BarChart, Bar, LabelList } from "recharts";

//création d'une interface pour chaque objet du tableau que l'on va utiliser et décrire la forme des données
interface ParisRecord {
  // dans tableau records, on va chercher type_tournage qui se trouve dans fields (= record.fields.type_tournage)
  fields: {
    type_tournage?: string;
  };
}

interface ApiResponse {
  // objet retourné par l'API avec la clé records
  records: ParisRecord[];
}

interface ChartItem {
  // format utilisé pour le graphique
  type: string;
  count: number;
  percent: number;
}

// état du graphique où chartData stocke les données et setChartData les met à jour
export default function SecondGraph() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);

  //récupération des données
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(
          "https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&rows=5000"
        );
        const data: ApiResponse = await res.json();

        // compte combien de fois chaque type de tournage apparaît
        const counts: Record<string, number> = {};

        // calcule le pourcentage de chaque type par rapport au total
        data.records.forEach((rec) => {
          const type = rec.fields.type_tournage || "Inconnu";
          counts[type] = (counts[type] || 0) + 1;
        });

        // trie les types du plus fréuent au moins fréquent
        const total = Object.values(counts).reduce((a, b) => a + b, 0);

        // met à jour chartData pour le graphique
        const formatted: ChartItem[] = Object.entries(counts)
          .map(([type, count]) => ({
            type,
            count,
            percent: Number(((count / total) * 100).toFixed(1)),
          }))
          .sort((a, b) => b.count - a.count);

        setChartData(formatted);
      } catch (e) {
        console.error("Erreur API:", e);
      }
    }

    fetchData();
  }, []);

  //affichage du graphique
  return (
    <div style={{ width: "100%", height: 600 }}>
      <h2 style={{ marginBottom: 20 }}>
        Répartition des types de tournages à Paris
      </h2>

      <ResponsiveContainer>
        <BarChart
          data={chartData}
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
