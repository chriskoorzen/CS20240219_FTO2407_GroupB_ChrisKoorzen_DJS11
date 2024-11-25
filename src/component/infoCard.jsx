import { AsyncImage } from "./asyncImage";

import { sanitizeHtmlLiterals } from "../utils/strings";

import { showGenres } from "../api/server";


export function FullShowPreview({ show }){

    // console.log("FullShowPreview", show)

    if (show === null){
        return <h1>Placeholder</h1>
    };

    return (
        <div 
            className="rounded-lg bg-gray-900 p-3 flex gap-5 text-white cursor-pointer"
        >
            <AsyncImage imgUrl={show.image} className="size-96 rounded-lg shrink-0"/>
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
                <div className="mt-5 flex justify-evenly">
                    <Link
                        to={`/show/${show.id}`}
                        className="rounded-full p-3 bg-gray-200 text-black"
                    >
                        Read More..
                    </Link>
                    <button className="rounded-full bg-green-400 p-3">Play Now</button>
                </div>
            </div>
        </div>
    );
};


export function FullShowHeader({ show }){

    return (
        <div className="text-white flex flex-col gap-5">
            <div className="flex flex-row ">
                <div className="w-48 shrink-0">
                    <AsyncImage
                        imgUrl={show.image}
                        className="size-48 rounded-lg border-2"
                    />
                    <div className="my-3 flex justify-evenly">
                        {
                            show.genres.map(genreID => {
                                return <p key={genreID} className="bg-purple-500 rounded-full p-2">{showGenres[genreID]}</p>
                            })
                        }
                    </div>
                </div>
                <div className="grow flex flex-col px-5">
                    {/* <h6 className="text-center text-5xl font-bold mb-4">{sanitizeHtmlLiterals(show.title)}</h6>
                    <div className="my-3 flex justify-evenly">
                        {
                            show.genres.map(genreID => {
                                return <p key={genreID} className="bg-purple-500 rounded-full p-2">{showGenres[genreID]}</p>
                            })
                        }
                    </div> */}
                    <p className="max-h-60 overflow-y-auto p-4 rounded-lg bg-gray-900">{show.description}</p>
                </div>
            </div>
        </div>
    );
};

