import { useState } from "react";
import FirstGraph from "./FirstGraph";
import SecondGraph from "./SecondGraph";

interface YearCount {
  year: string;
  count: number;
}

interface ChartItem {
  type: string;
  count: number;
  percent: number;
}

export function Cards() {
  const [graphData, setGraphData] = useState<YearCount[]>([]);
  const [typeData, setTypeData] = useState<ChartItem[]>([]);

  // Callbacks pour récupérer les données
  const handleYearData = (data: YearCount[]) => setGraphData(data);
  const handleTypeData = (data: ChartItem[]) => setTypeData(data);

  // Calculer la moyenne et le total
  const totalTournages = graphData.reduce((sum, item) => sum + item.count, 0);
 
  // Type de tournage le plus fréquent
  const mostFrequentType =
    typeData.length > 0 ? typeData[0].type : "N/A";

  return (
    <>
      <div className="flex gap-4 mt-8 mr-20 ml-20">
        <p className="bg-white rounded-lg px-4 py-5 w-72">
          <strong>Nombre total de tournages :</strong>
          <br />
          {totalTournages || "N/A"}
        </p>

        <p className="bg-white rounded-lg px-4 py-5 w-72">
          <strong>Type de tournage le plus fréquent :</strong>
          <br />
    {mostFrequentType}
        </p>

        <p className="bg-white rounded-lg px-4 py-5 w-72">
          <strong></strong>
          <br />
          
        </p>

        <p className="bg-white rounded-lg px-4 py-5 w-72"></p>
      </div>

      {/* 🔥 Les graphiques envoient leurs données via callbacks, on peut les cacher */}
      <div className="mt-10 hidden">
        <FirstGraph onData={handleYearData} />
        <SecondGraph onData={handleTypeData} />
      </div>
    </>
  );
}
