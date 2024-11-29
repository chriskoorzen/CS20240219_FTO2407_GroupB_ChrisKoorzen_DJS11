import { Suspense, useState } from "react";
import { Await, Link, useOutletContext } from "react-router-dom";
import { useRouteLoaderData } from "react-router";

import { Dialog } from "@material-tailwind/react";

import { ImageSlider, SliderItem } from "../component/basic";
import { FullShowPreview, SmallShowPreview, SmallGenrePreview } from "../component/infoCard";
import { LoadingSpinner } from "../component/loaders";

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
            <h1 className="text-white text-3xl font-bold text-center mb-12 mt-5">
                Discover the best shows from around the world
            </h1>
            <Suspense fallback={<LoadingSpinner loadingText={"All Titles"}/>}>
                <Await resolve={previews}>
                    {previews => {
                        const sortedPreviews = previews.toSorted((a, b) => a.title > b.title);
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
                                        <SliderItem>
                                            <SmallShowPreview show={el} />
                                        </SliderItem>
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
                <Await resolve={ Promise.all([previewsByIndex, ...Object.values(genres)]) }>
                    {data => {
                        const previewsByIndex = data[0];
                        let suggestions;
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
                                <ImageSlider setActiveIndexCallback={(pos)=>{selectShowPreview(pos, suggestions)}}>
                                    {suggestions.map(el => (
                                        <SliderItem key={el.title}>
                                            <SmallShowPreview show={el} />
                                        </SliderItem>
                                    ))}
                                </ImageSlider>
                            </div>

                            <div className="my-8">
                                <Link
                                    to="/browse/genres"
                                    className="text-lg text-white"
                                >
                                    Browse Genres <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider>
                                    {genreStockImages.map((el, index)=> (
                                        <SliderItem key={showGenres[el.id]}>
                                            <SmallGenrePreview genre={el}/>
                                        </SliderItem>
                                    ))}
                                </ImageSlider>
                            </div>
                            </>
                        );
                    }}
                </Await>
            </Suspense>
            
        </div>
    );
};
