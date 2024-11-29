import { Suspense, useRef, useState, useEffect } from "react";
import { Await, useSearchParams } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";

import { Input, Button, Dialog } from "@material-tailwind/react";

import { SmallerShowPreview, FullShowPreview } from "../component/infoCard";

import { showGenres } from "../api/server";

export function BrowsePage(){
    const { previews } = useRouteLoaderData("root");
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortOption, setSortOption] = useState("A-Z");       // "A-Z", "Z-A", "Latest", "Oldest"
    const [showPreview, setShowPreview] = useState(false);
    const [showObject, setShowObject] = useState(null);


    function toggleSearchParams(key, value){
        const exists = searchParams.has(key, value);

        if (exists) searchParams.delete(key, value);
        else searchParams.append(key, value);

        setSearchParams(searchParams);
    };

    function handleTitleSearchInput(event){
        if (event.target.value==="") searchParams.delete("title");
        else searchParams.set("title", event.target.value);

        setSearchParams(searchParams);
    };

    return (
        <div className="size-full flex flex-col justify-start items-center">
            <div className="w-full flex items-center justify-evenly">
                <h1 className="text-white text-2xl font-bold">Browse All Titles</h1>
                <div className="relative flex gap-2 w-96 my-4">
                    <Input
                        type="search"
                        color="white"
                        label="Search Titles..."
                        className="pr-20"
                        containerProps={{ className: "min-w-72" }}
                        value={searchParams.has("title") ? searchParams.get("title") : ""}
                        onChange={handleTitleSearchInput}
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
            </div>

            <div className="w-full flex flex-row gap-10 mb-6 items-center text-white">
                <div className="h-full w-36 flex flex-col justify-evenly">
                    <p className="font-bold">Filter by Genre:</p>
                    <button
                        className="text-start hover:underline"
                        onClick={()=>{setSearchParams(params => {params.delete("genre"); return params})}}>
                            Clear Genres
                        </button>
                </div>
                <div className="flex flex-row gap-2 flex-wrap">
                    {Object.entries(showGenres).map(([id, genre]) =>
                        <button
                        onClick={()=>{toggleSearchParams("genre", id)}}
                        className={
                            `${searchParams.getAll("genre").includes(String(id)) ? "bg-purple-300" : ""}
                            rounded-lg p-3
                            `}
                            >
                            {genre}
                        </button>
                    )}
                </div>
            </div>

            <div className="text-white w-full flex justify-start items-center mb-2">
                <p className="w-40 font-bold">Sort By:</p>
                <div className="flex justify-around w-96">
                    <button
                        className={`${sortOption==="A-Z"? "bg-purple-300 font-bold": ""} p-2 rounded-xl`}
                        onClick={()=>{setSortOption("A-Z")}}
                    >A-Z
                    </button>
                    <button
                        className={`${sortOption==="Z-A"? "bg-purple-300 font-bold": ""} p-2 rounded-xl`}
                        onClick={()=>{setSortOption("Z-A")}}
                    >Z-A
                    </button>
                    <button
                        className={`${sortOption==="Latest"? "bg-purple-300 font-bold": ""} p-2 rounded-xl`}
                        onClick={()=>{setSortOption("Latest")}}
                    >Latest
                    </button>
                    <button
                        className={`${sortOption==="Oldest"? "bg-purple-300 font-bold": ""} p-2 rounded-xl`}
                        onClick={()=>{setSortOption("Oldest")}}
                    >Oldest
                    </button>
                </div>
            </div>
            <hr className="fill-white w-full h-3 mb-4"/>

            <Dialog
                open={showPreview}
                handler={()=>{setShowPreview(false)}}
                className="md:size-fit lg:size-fit 2xl:size-fit md:max-w-fit lg:max-w-fit 2xl:max-w-fit md:min-w-fit lg:min-w-fit 2xl:min-w-fit">
                <FullShowPreview show={showObject}/>
            </Dialog>
            <div
                className="w-full flex flex-row flex-wrap content-start justify-start gap-3 overflow-y-auto"
            >
                <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                    <Await resolve={previews}>
                        {previews => {
                            if (searchParams.has("title")){
                                previews = previews.filter(preview => preview.title.toLowerCase().includes(searchParams.get("title").toLowerCase()));
                            };

                            searchParams.getAll("genre").forEach(genre => {
                                previews = previews.filter(preview => preview.genres.includes(parseInt(genre)));
                            });

                            switch (sortOption){
                                case "A-Z":
                                    previews = previews.toSorted((a, b)=> a.title > b.title);
                                    break;
                                case "Z-A":
                                    previews = previews.toSorted((a, b)=> a.title < b.title);
                                    break;
                                case "Latest":
                                    previews = previews.toSorted((a, b)=> new Date(a.updated) < new Date(b.updated));
                                    break;
                                case "Oldest":
                                    previews = previews.toSorted((a, b)=> new Date(a.updated) > new Date(b.updated));
                                    break;
                            };

                            return previews.map(el =>
                                <div key={el.title} onClick={()=>{setShowObject(el); setShowPreview(true)}}>
                                    <SmallerShowPreview show={el}/>
                                </div>
                            )}
                        }
                    </Await>
                </Suspense>
            </div>
        </div>
    );
};
