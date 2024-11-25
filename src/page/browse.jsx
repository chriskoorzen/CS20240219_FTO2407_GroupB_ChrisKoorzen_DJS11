import { Suspense, useRef, useState, useEffect } from "react";
import { Await, useSearchParams } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";

import { Input, Button } from "@material-tailwind/react";

import { FullShowPreview } from "../component/infoCard";
import { AsyncImage } from "../component/basic";

import { showGenres } from "../api/server";

export function BrowsePage(){
    const { previews } = useRouteLoaderData("root");
    const [searchParams, setSearchParams] = useSearchParams({"title": ""});
    const [sortOption, setSortOption] = useState("A-Z");       // "A-Z", "Z-A", "Latest", "Oldest"

    function toggleSearchParams(key, value){
        const exists = searchParams.has(key, value);

        if (exists) searchParams.delete(key, value);
        else searchParams.append(key, value);

        setSearchParams(searchParams);
    };


    return (
        <div className="size-full flex flex-col justify-start items-center">

            <div className="relative flex gap-2 w-96">
                <Input
                    type="search"
                    color="white"
                    label="Search Titles..."
                    className="pr-20"
                    containerProps={{ className: "min-w-72" }}
                    value={searchParams.get("title")}
                    onChange={(event)=>{searchParams.set("title", event.target.value); setSearchParams(searchParams);}}
                />
                <Button
                    size="sm"
                    color="white"
                    className="!absolute right-1 top-1 rounded"
                    onClick={()=>{searchParams.delete("title"); setSearchParams(searchParams);}}
                >
                    Clear
                </Button>
            </div>
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
            <div>
                <button
                    className={`${sortOption==="A-Z"? "bg-green-300": ""}`}
                    onClick={()=>{setSortOption("A-Z")}}
                >A-Z
                </button>
                <button
                    className={`${sortOption==="Z-A"? "bg-green-300": ""}`}
                    onClick={()=>{setSortOption("Z-A")}}
                >Z-A
                </button>
                <button
                    className={`${sortOption==="Latest"? "bg-green-300": ""}`}
                    onClick={()=>{setSortOption("Latest")}}
                >Latest
                </button>
                <button
                    className={`${sortOption==="Oldest"? "bg-green-300": ""}`}
                    onClick={()=>{setSortOption("Oldest")}}
                >Oldest
                </button>
            </div>
            <div className="w-full flex flex-row flex-wrap content-start justify-start gap-3 overflow-y-auto">
                <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                    <Await
                        resolve={previews}
                        children={previews => {
                            previews = previews.filter(preview => preview.title.toLowerCase().includes(searchParams.get("title").toLowerCase()));

                            searchParams.getAll("genre").forEach(genre => {
                                previews = previews.filter(preview => preview.genres.includes(parseInt(genre)));
                            });

                            switch (sortOption){
                                case "A-Z":
                                    previews.sort((a, b)=> a.title > b.title);
                                    break;
                                case "Z-A":
                                    previews.sort((a, b)=> a.title < b.title);
                                    break;
                                case "Latest":
                                    previews.sort((a, b)=> new Date(a.updated) < new Date(b.updated));
                                    break;
                                case "Oldest":
                                    previews.sort((a, b)=> new Date(a.updated) > new Date(b.updated));
                                    break;
                            };

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
