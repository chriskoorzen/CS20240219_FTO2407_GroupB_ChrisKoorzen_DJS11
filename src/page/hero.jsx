import { Suspense, useRef, useState } from "react";
import { Await, Link, useOutletContext } from "react-router-dom";
import { useRouteLoaderData } from "react-router";

import { Dialog } from "@material-tailwind/react";

import { FullShowPreview, SmallShowPreview } from "../component/infoCard";
import { AsyncImage, ImageSlider, ImageSlider2, SliderItem } from "../component/basic";

import { genreStockImages, showGenres } from "../api/server";
import { users, showUUID } from "../api/storage";
import { generateUserSuggestions } from "../utils/data";


export function LandingPage(){
    const { previews, previewsByIndex, genres } = useRouteLoaderData("root");
    const { userID } = useOutletContext();
    const [showPreview, setShowPreview] = useState(false);
    const [showObject, setShowObject] = useState(null);
    const [hasFavorites] = useState(
        userID ? Object.entries(users.getUserData(userID).favorites).length : null
    );

    function selectShowPreview(pos, array){
        setShowObject(array[pos]);
        setShowPreview(true);
    };

    return (
        <div className="w-full overflow-y-auto "> {/** flex flex-col justify-between items-center */}
            <Dialog
                open={showPreview}
                handler={()=>{setShowPreview(false)}}
                className="md:size-fit lg:size-fit 2xl:size-fit md:max-w-fit lg:max-w-fit 2xl:max-w-fit md:min-w-fit lg:min-w-fit 2xl:min-w-fit">
                <FullShowPreview show={showObject}/>
            </Dialog>
            <h1 className="text-white text-3xl font-bold text-center">
                Discover the best shows from around the world
            </h1>
            <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                <Await resolve={previews}>
                    {previews => {
                        const sortedPreviews = previews.toSorted((a, b) => a.title > b.title);
                        console.log("RENDER")
                        return (
                            <>
                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Browse All Titles <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider setActiveIndexCallback={(pos)=>{selectShowPreview(pos, sortedPreviews)}}>
                                    {sortedPreviews.map(el => (
                                        <SmallShowPreview show={el} />
                                    ))}
                                </ImageSlider>

                                {/* { userID ? <>
                                <Link
                                    to={`${userID}/favorites`}
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
                                </> : null } */}
                            </>
                        );
                    }}
                </Await>
            </Suspense>
            <Suspense fallback={<h1 className="text-2xl font-bold p-4 text-center">Loading blog posts...</h1>}>
                <Await resolve={ Promise.all([previewsByIndex, ...Object.values(genres)]) }>
                    {data => {
                        const previewsByIndex = data[0];
                        let suggestions;
                        console.log("rendereeer")
                        if (hasFavorites){
                            suggestions = generateUserSuggestions(
                                Object.keys(users.getUserData(userID).favorites).map(UUID => showUUID.parse(UUID).showID),
                                previewsByIndex,
                                data.slice(1).sort((a, b) => a.id > b.id)
                            );
                        } else {
                            suggestions = Object.values(previewsByIndex);
                        };

                        return (
                            <>
                            <div className="my-8">
                                <h1 className="text-lg text-white">Recommended for You</h1>
                                <ImageSlider2 setActiveIndexCallback={(pos)=>{selectShowPreview(pos, suggestions)}}>
                                    {suggestions.map(el => (
                                        <SliderItem key={el.title}>
                                            <SmallShowPreview show={el} />
                                        </SliderItem>
                                    ))}
                                </ImageSlider2>
                            </div>
                            <div className="my-8">
                                <Link
                                    to="/browse/genres"
                                    className="text-lg text-white"
                                >
                                    Browse Genres <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider2>
                                    {genreStockImages.map((el, index)=> (
                                        <SliderItem key={showGenres[el.id]}>
                                        <div className="relative w-48 h-36 bg-gray-900 rounded-lg">
                                            <AsyncImage imgUrl={el.image} className="pt-2"/>
                                            <p className="absolute bottom-3 text-white font-bold text-wrap text-shadow px-3">{showGenres[el.id]}</p>
                                        </div>
                                        </SliderItem>
                                    ))}
                                </ImageSlider2>
                            </div>
                            </>
                        );
                    }}
                </Await>
            </Suspense>
            
        </div>
    );
};
