import { Suspense, useRef, useState } from "react";
import { Await, Link } from "react-router-dom";
import { useRouteLoaderData } from "react-router";

import { Dialog } from "@material-tailwind/react";

import { FullShowPreview } from "../component/infoCard";
import { AsyncImage, ImageSlider } from "../component/basic";

import { genreStockImages, showGenres } from "../api/server";


export function LandingPage(){
    const { previews } = useRouteLoaderData("root");
    const [open, setOpen] = useState(false);
    const [focusItem, setFocusItem] = useState(null);


    function selectShowPreview(pos, array){
        setFocusItem(array[pos]);
        setOpen(true);
    };

    return (
        <div className="w-full overflow-y-auto "> {/** flex flex-col justify-between items-center */}
            <h1 className="text-white text-3xl font-bold text-center">
                Discover the best shows from around the world
            </h1>
            <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                <Await 
                    resolve={previews} 
                    children={previews => {
                        const sortedPreviews = previews.toSorted((a, b) => a.title > b.title);
                        return (
                            <>
                                <Dialog open={open} handler={()=>{setOpen(false)}}>
                                    <FullShowPreview show={focusItem}/>
                                </Dialog>

                                <div className="my-8">
                                    <h1 className="text-lg text-white">Recommended for You</h1>
                                    <ImageSlider setActiveIndexCallback={(pos)=>{selectShowPreview(pos, previews)}}>
                                        {previews.map(el => (
                                            <AsyncImage
                                                className="size-40 rounded-lg"
                                                imgUrl={el.image}
                                            />
                                        ))}
                                    </ImageSlider>
                                </div>

                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Browse All Titles <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider setActiveIndexCallback={(pos)=>{selectShowPreview(pos, sortedPreviews)}}>
                                    {sortedPreviews.map(el => (
                                        <AsyncImage
                                            className="size-40 rounded-lg"
                                            imgUrl={el.image}
                                        />
                                    ))}
                                </ImageSlider>

                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Browse Genres <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider
                                    setActiveIndexCallback={(el)=>{console.log(`Genres now at index ${el}`)}}
                                >
                                    {genreStockImages.map((el, index)=> (
                                        <div className="relative w-48 h-36 bg-gray-900 rounded-lg">
                                            <AsyncImage imgUrl={el.image} className="pt-2"/>
                                            <p className="absolute bottom-3 text-white font-bold text-wrap text-shadow px-3">{showGenres[el.id]}</p>
                                        </div>
                                    ))}
                                </ImageSlider>

                                {/**If logged in, show "Your favorites", and "Watch Again", "Continue Watching" */}

                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Favourites <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider setActiveIndexCallback={(pos)=>{selectShowPreview(pos, previews)}}>
                                    {previews.map(el => (
                                        <AsyncImage
                                            className="size-40 rounded-lg"
                                            imgUrl={el.image}
                                        />
                                    ))}
                                </ImageSlider>
                            </>
                        );
                    }}>
                </Await>
            </Suspense>
        </div>
    );
};
