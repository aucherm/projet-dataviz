import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Tournage {
  fields: {
    nom_realisateur: string;
    annee_tournage?: string;
    type_tournage?: string;
  };
}

interface TopRealisateur {
  nom: string;
  count: number;
  annees: string[];
  types: string[];
}

interface DirectorCount {
  name: string;
  count: number;
}

const fetchTournages = async (): Promise<Tournage[]> => {
  const res = await fetch(
    "https://opendata.paris.fr/api/records/1.0/search/?dataset=lieux-de-tournage-a-paris&rows=100"
  );
  const data = await res.json();
  return data.records;
};

// Fonction pour générer le top 5
const getTopRealisateurs = (tournages: Tournage[]): TopRealisateur[] => {
  const map: Record<string, TopRealisateur> = {};

  tournages.forEach((t) => {
    const nom = t.fields.nom_realisateur || "Inconnu";
    if (!map[nom]) map[nom] = { nom, count: 0, annees: [], types: [] };
    map[nom].count += 1;
    if (t.fields.annee_tournage) map[nom].annees.push(t.fields.annee_tournage);
    if (t.fields.type_tournage) map[nom].types.push(t.fields.type_tournage);
  });

  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

interface Props {
  onData?: (data: DirectorCount[]) => void;
}

const TopRealisateursChart: React.FC<Props> = ({onData }) => {
  const [tournages, setTournages] = useState<Tournage[]>([]);
  const [data, setData] = useState<TopRealisateur[]>([]);
  const [anneeFilter, setAnneeFilter] = useState<string>("Tous");
  const [typeFilter, setTypeFilter] = useState<string>("Tous");

  const [anneesDisponibles, setAnneesDisponibles] = useState<string[]>([]);
  const [typesDisponibles, setTypesDisponibles] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const records = await fetchTournages();
      setTournages(records);

      const anneesSet = new Set<string>();
      const typesSet = new Set<string>();
      records.forEach((t) => {
        if (t.fields.annee_tournage) anneesSet.add(t.fields.annee_tournage);
        if (t.fields.type_tournage) typesSet.add(t.fields.type_tournage);
      });
      setAnneesDisponibles(["Tous", ...Array.from(anneesSet).sort()]);
      setTypesDisponibles(["Tous", ...Array.from(typesSet).sort()]);
    };
    loadData();
  }, []);

  useEffect(() => {
    let filtered = [...tournages];

    if (anneeFilter !== "Tous") {
      filtered = filtered.filter(
        (t) => t.fields.annee_tournage === anneeFilter
      );
    }
    if (typeFilter !== "Tous") {
      filtered = filtered.filter((t) => t.fields.type_tournage === typeFilter);
    }

    const top5 = getTopRealisateurs (filtered);
    setData(top5);

   if (onData) {
      onData(
        top5.map((r) => ({
          name: r.nom,
          count: r.count,
        }))
      );
    }
  }, [tournages, anneeFilter, typeFilter]);


  return (
    <div className="w-full bg-white rounded-xl shadow p-4">
     <h2 style={{ marginBottom: 20, color: "#282b12", textAlign: "center"}}>
        Top réalisateurs / réalisatrices à Paris
      </h2>

      {/* Filtres */}
      <div className="flex gap-4 mb-4">
        <div>
          <label className="mr-2 font-medium">Année :</label>
          <select
            value={anneeFilter}
            onChange={(e) => setAnneeFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {anneesDisponibles.map((annee) => (
              <option key={annee} value={annee}>
                {annee}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 font-medium">Type :</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            {typesDisponibles.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* BarChart */}
      <div className="w-full h-[400px] min-h[400px]">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            layout="horizontal"
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <defs>
              <linearGradient id="myGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor="#6A7330" />
                <stop offset="100%" stopColor="#1A1B0D" />
              </linearGradient>
            </defs>

            <XAxis type="category" dataKey="nom" angle={-45} textAnchor="end" />
            <YAxis type="number" />
            <Tooltip
              formatter={(value: any, _name: any, props: any) => {
                const { annees, types } = props.payload;
                return [
                  value,
                  `Années: ${annees?.join(", ")} | Types: ${types?.join(", ")}`,
                ];
              }}
            />
            <Bar dataKey="count" fill="url(#myGradient)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopRealisateursChart;
