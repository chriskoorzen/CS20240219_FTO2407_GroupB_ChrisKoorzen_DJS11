import { showGenres } from "../api/server";


export function FullShowPreview({ show }){

    console.log("FullShowPreview", show)

    if (show === null){
        return <h1>Placeholder</h1>
    };

    return (
        <div className="rounded-lg w-[600px] bg-green-900 p-3">
            <img src={show.image} className="size-96"/>
            <h6>{show.title}</h6>
            <p>{show.seasons > 1 ? `${show.seasons} Seasons` : `${show.seasons} Season`}</p>
            <p>{show.description}</p>
            <p>{new Date(show.updated).toLocaleDateString(undefined, {year: "numeric",month: "short"})}</p>
            {
                show.genres.map(genreID => {
                    return <p key={genreID}>{showGenres[genreID]}</p>
                })
            }
        </div>
    );
};

