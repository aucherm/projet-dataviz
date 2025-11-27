async function fetchApi(){
    const api = await fetch("https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/lieux-de-tournage-a-paris/records?limit=100")
    const json = await api.json()

    return json
}

export function FifthGraph(){
    return(
        <div></div>
    )
}