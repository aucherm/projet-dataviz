import { Header } from "../components/Header";
import { Main } from "../components/Main";
import { Cards } from "../components/Cards";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[url('/paris-6803796_1280.jpg')] bg-center bg-cover bg-fixed">
      <div className="justify-start">
        <Header />
      </div>
      <div className="flex-grow">
        <Main />
        <Cards />
      </div>
      <Footer />
    </div>
  );
}
