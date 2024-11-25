import { Suspense, useRef, useState } from "react";
import { Await, Link } from "react-router-dom";
import { useRouteLoaderData } from "react-router";

import { Dialog } from "@material-tailwind/react";

import { FullShowPreview } from "../component/infoCard";
import { ImageSlider } from "../component/basic";


export function LandingPage(){
    const { previews } = useRouteLoaderData("root");
    const [open, setOpen] = useState(false);
    const [focusItem, setFocusItem] = useState(null);
    
    function selectItemForDisplay(item){
        setFocusItem(item);
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
                        return (
                            <>
                                <Dialog open={open} handler={()=>{setOpen(false)}}>
                                    <FullShowPreview show={focusItem}/>
                                </Dialog>
                                
                                <div className="my-8">
                                    <h1 className="text-lg text-white">Recommended for You</h1>
                                    <ImageSlider
                                        showArray={previews}
                                        activeCallback={selectItemForDisplay}
                                    />
                                </div>

                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Browse All Titles <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider
                                    showArray={previews.toSorted((a, b) => a.title > b.title)}
                                    activeCallback={selectItemForDisplay}
                                />

                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Browse Genres <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider
                                    showArray={previews}
                                    activeCallback={selectItemForDisplay}
                                />

                                {/**If logged in, show "Your favorites", and "Watch Again" */}

                                <Link
                                    to="/browse"
                                    className="text-lg text-white"
                                >
                                    Favourites <i className="fas fa-arrow-right" />
                                </Link>
                                <ImageSlider
                                    showArray={previews}
                                    activeCallback={selectItemForDisplay}
                                />
                            </>
                        );
                    }}>
                </Await>
            </Suspense>
        </div>
    );
};
