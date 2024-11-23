import { showGenres } from "../api/server";

import { sanitizeHtmlLiterals } from "../utils/strings";


export function FullShowPreview({ show }){

    // console.log("FullShowPreview", show)

    if (show === null){
        return <h1>Placeholder</h1>
    };

    return (
        <div 
            className="rounded-lg bg-gray-900 p-3 flex gap-5 text-white cursor-pointer"
        >
            <img src={show.image} className="size-96 rounded-lg"/>
            <div>
                <h6 className="text-2xl font-bold mb-4">{sanitizeHtmlLiterals(show.title)}</h6>
                <div className="flex justify-between">
                    <p>{show.seasons > 1 ? `${show.seasons} Seasons` : `${show.seasons} Season`}</p>
                    <p>{new Date(show.updated).toLocaleDateString(undefined, {year: "numeric",month: "short"})}</p>
                </div>
                <div className="my-3 flex gap-5">
                    {
                        show.genres.map(genreID => {
                            return <p key={genreID} className="bg-purple-500 rounded-full p-2">{showGenres[genreID]}</p>
                        })
                    }
                </div>
                <p className="line-clamp-6">{show.description}</p>
            </div>
        </div>
    );
};

