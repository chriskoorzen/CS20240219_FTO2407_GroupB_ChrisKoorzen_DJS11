import { Suspense, useRef, useState, useEffect } from "react";
import { useParams, Await, useNavigate } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";

import { AsyncImage } from "../component/basic";
import { FullShowHeader, SeasonSelector } from "../component/infoCard";

import { getShowInfo } from "../api/server";


export function FullShowPage(){
    const navigate = useNavigate();
    const showID = useParams().showid;
    const { previews, shows } = useRouteLoaderData("root");

    console.log("Shows Page", showID, previews)

    if (!shows[showID]){
        shows[showID] = getShowInfo([showID]);
        console.log(`Show ${showID} not found`, shows);
    };

    return (
        <>
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 rounded-lg px-4 py-2 z-10 mb-4"
            >
                    <i className="fas fa-arrow-left" /> Go Back
            </button>
            <Suspense fallback={<h1>Loading Show Header...</h1>}>
                <Await
                    resolve={previews.then(preArray => preArray.reduce(((obj, show) => {obj[show.id] = show; return obj}), {}))}
                    children={indexedPreviews => 
                        <FullShowHeader show={indexedPreviews[showID]}/>
                    }
                >
                </Await>
            </Suspense>
            
            <Suspense fallback={<h1>Loading Seasons...</h1>}>
                <Await
                    resolve={shows[showID]}
                    children={showByID =>
                        <SeasonSelector show={showByID}/>
                    }
                >
                </Await>
            </Suspense>
        </>
    );
};