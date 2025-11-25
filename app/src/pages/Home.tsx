import { Header } from "../components/Header"
import { Main } from "../components/Main"
import { Cards } from "../components/Cards"


export default function Home (){
    return (
        <div className="bg-[url('/paris-6803796_1280.jpg')] bg-center bg-cover">
            <Header/>
            <Main/>
            <Cards/>

        </div>
    )
}