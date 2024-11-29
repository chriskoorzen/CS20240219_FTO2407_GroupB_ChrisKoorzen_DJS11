import { Suspense, useRef, useState, useEffect } from "react";
import { Await, useSearchParams } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";

import { Input, Button, Dialog } from "@material-tailwind/react";

import { FullShowPreview, SmallShowPreview } from "../component/infoCard";
import { AsyncImage, ImageSlider, SliderItem } from "../component/basic";

import { showGenres, genreStockImages } from "../api/server";

export function GenresPage(){
    const { previewsByIndex, genres } = useRouteLoaderData("root");
    const [showPreview, setShowPreview] = useState(false);
    const [showObject, setShowObject] = useState(null);

    return (
        <div className="size-full flex flex-col justify-start items-center">
            <div className="w-full px-24 text-white flex flex-row flex-wrap content-start justify-start gap-3 overflow-y-auto">
                <h1 className="text-white text-2xl font-bold my-10">Discover our wonderful Genres on offer</h1>
                <Dialog
                    open={showPreview}
                    handler={()=>{setShowPreview(false)}}
                    className="md:size-fit lg:size-fit 2xl:size-fit md:max-w-fit lg:max-w-fit 2xl:max-w-fit md:min-w-fit lg:min-w-fit 2xl:min-w-fit">
                    <FullShowPreview show={showObject}/>
                </Dialog>
                <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading genres...</h1>}>
                    <Await resolve={Promise.all([previewsByIndex, ...Object.values(genres)])}>
                        {genreData => {
                            const previewsByIndex = genreData[0];
                            console.log("GENRES:::")
                            return genreData.slice(1).map((genre, index) => (
                                <div className="w-full mb-20">
                                    <div className="relative bg-gray-400/20 rounded-lg mb-6">
                                        <AsyncImage
                                            imgUrl={genreStockImages[index].image}
                                            className="h-86 rounded-lg mx-auto opacity-40"
                                        />
                                        <p className="absolute top-4 right-1/2 text-3xl text-shadow font-bold">{genre.title}</p>
                                        <p className="absolute bottom-4 px-24 py-4 bg-gray-900/80 ">{genre.description}</p>
                                    </div>
                                    <ImageSlider >
                                        {genre.shows.map(showID => 
                                            <SliderItem key={showID}>
                                                <div onClick={()=>{setShowObject(previewsByIndex[showID]); setShowPreview(true)}}>
                                                    <SmallShowPreview show={previewsByIndex[showID]}/>
                                                </div>
                                            </SliderItem>
                                        )}
                                    </ImageSlider>
                                    <hr className="my-3 border-purple-300 bg-purple-300 text-purple-300"/>
                                </div>
                            ));
                        
                        }}
                    </Await>
                </Suspense>
            </div>
        </div>
    );
};
