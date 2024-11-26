import { Suspense, useRef, useState, useEffect } from "react";
import { Await, useSearchParams } from "react-router-dom";
import { useRouteLoaderData, useAsyncValue } from "react-router";

import { Input, Button } from "@material-tailwind/react";

import { FullShowPreview } from "../component/infoCard";
import { AsyncImage, ImageSlider } from "../component/basic";

import { showGenres, genreStockImages } from "../api/server";

export function GenresPage(){
    const { previewsByIndex, genres } = useRouteLoaderData("root");

    return (
        <div className="size-full flex flex-col justify-start items-center">

            <div className="w-full flex flex-row flex-wrap content-start justify-start gap-3 overflow-y-auto">
                <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading genres...</h1>}>
                    <Await
                        resolve={Promise.all([previewsByIndex, ...Object.values(genres)])}
                        children={genreData => {
                            const previews = genreData.shift();
                            
                            return genreData.map((genre, index) => (
                                <div>
                                    <AsyncImage imgUrl={genreStockImages[index].image} className="size-40 rounded-lg" />
                                    <p>{genre.title}</p>
                                    <p>{genre.description}</p>
                                    <ImageSlider>
                                        {genre.shows.map(show => (
                                            <AsyncImage imgUrl={previews[show].image} className="size-40 rounded-lg"/>
                                        ))}
                                    </ImageSlider>
                                </div>
                            ));
                        
                        }}
                    >
                    </Await>
                </Suspense>
            </div>
        </div>
    );
};
