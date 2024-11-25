import { Suspense, useRef, useState, useEffect } from "react";
import { Await, useSearchParams } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";

import { FullShowPreview } from "../component/infoCard";
import { AsyncImage } from "../component/basic";

import { showGenres } from "../api/server";

export function BrowsePage(){
    const { previews } = useRouteLoaderData("root");
    const [searchParams, setSearchParams] = useSearchParams();

    function toggleSearchParams(key, value){
        const exists = searchParams.has(key, value);

        if (exists) searchParams.delete(key, value);
        else searchParams.append(key, value);

        setSearchParams(searchParams);
    };

    return (
        <div className="size-full flex flex-col justify-start items-center">
            
            <h1 className="text-white text-3xl font-bold text-center">
                Search functionality here
            </h1>
            <div className="flex flex-row gap-2 flex-wrap">
                {Object.entries(showGenres).map(([id, genre]) =>
                    <button
                        onClick={()=>{toggleSearchParams("genre", id)}}
                        className={
                            `${searchParams.getAll("genre").includes(String(id)) ? "bg-lime-400" : ""}
                            rounded-lg p-3
                        `}
                    >
                        {genre}
                    </button>
                )}
                <button onClick={()=>{setSearchParams(params => {params.delete("genre"); return params})}}>Clear All</button>
            </div>
            <div className="w-full flex flex-row flex-wrap content-start justify-start gap-3 overflow-y-auto">
                <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                    <Await
                        resolve={previews}
                        children={previews => {
                            searchParams.getAll("genre").forEach(genre => {
                                previews = previews.filter(preview => preview["genres"].includes(parseInt(genre)));
                            })

                            return previews.map((el, index) => 
                                <AsyncImage key={index} imgUrl={el.image} className={"size-40 rounded-lg"}/>
                            )}
                        }
                    >
                    </Await>
                </Suspense>
            </div>
        </div>
    );
};
