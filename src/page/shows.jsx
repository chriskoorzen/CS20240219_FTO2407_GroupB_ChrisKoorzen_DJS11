import { Suspense, createContext } from "react";
import { useParams, Await, Link } from "react-router-dom";
import { useRouteLoaderData } from "react-router";

import { ShowHeader, SeasonSelector } from "../component/infoCard";
import { LoadingSpinner } from "../component/loaders";

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
            {/* <Link
                to="/"
                className="inline-block bg-gray-200 rounded-lg px-4 py-2 z-10 mb-4"
            >
                <i className="fas fa-arrow-left" /> Go Back
            </Link> */}

            <Suspense fallback={<LoadingSpinner loadingText={"show data"}/>}>
                <Await resolve={previewsByIndex}>
                    {indexedPreviews => 
                        <ShowHeader show={indexedPreviews[showID]}/>
                    }
                </Await>
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner loadingText={"season data"}/>}>
                <Await resolve={shows[showID]}>
                    {show =>
                        <ShowContext.Provider value={{ show }}>
                            <SeasonSelector seasonID={seasonID}/>
                        </ShowContext.Provider>
                    }
                </Await>
            </Suspense>
        </>
    );
};