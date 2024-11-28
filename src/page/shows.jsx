import { Suspense, createContext } from "react";
import { useParams, Await, Link } from "react-router-dom";
import { useRouteLoaderData } from "react-router";

import { AsyncImage } from "../component/basic";
import { ShowHeader, SeasonSelector } from "../component/infoCard";

import { getShowInfo } from "../api/server";


export const ShowContext = createContext(null);

export function FullShowPage(){
    const { showID, seasonID } = useParams();
    const { previewsByIndex, shows } = useRouteLoaderData("root");

    console.log("Shows Page", showID, seasonID)

    if (!shows[showID]){    // Load data if not exists
        shows[showID] = getShowInfo([showID]);
        console.log(`Show ${showID} not found`, shows);
    };

    return (
        <>
            <Link
                to="/"
                className="inline-block bg-gray-200 rounded-lg px-4 py-2 z-10 mb-4"
            >
                    <i className="fas fa-arrow-left" /> Go Back
            </Link>
            <Suspense fallback={<h1>Loading Show Header...</h1>}>
                <Await
                    resolve={previewsByIndex}
                    children={indexedPreviews => 
                        <ShowHeader show={indexedPreviews[showID]}/>
                    }
                >
                </Await>
            </Suspense>
            
            <Suspense fallback={<h1>Loading Seasons...</h1>}>
                <Await
                    resolve={shows[showID]}
                    children={show =>
                        <ShowContext.Provider value={{ show }}>
                            <SeasonSelector seasonID={seasonID}/>
                        </ShowContext.Provider>
                    }
                >
                </Await>
            </Suspense>
        </>
    );
};