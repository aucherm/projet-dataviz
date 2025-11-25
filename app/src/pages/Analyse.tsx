import FirstGraph from "../components/FirstGraph";
import { Header } from "../components/Header";
import SecondGraph from "../components/SecondGraph";
import ThirdGraph from "../components/ThirdGraph";

export default function Analyse() {
  return (
    <div className="bg-[#e8d6cc] min-h-screen">
      <div>
      <Header />
      <div className="flex gap-6 px-6 py-4">
      <FirstGraph />
      <SecondGraph />
      <ThirdGraph />
    </div>
  );
}
