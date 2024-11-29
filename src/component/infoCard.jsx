import { useState, useContext } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { Progress } from "@material-tailwind/react";
import { BsStar, BsStarFill } from "react-icons/bs";

import { AsyncImage, ImageSlider } from "./basic";

import { sanitizeHtmlLiterals } from "../utils/strings";
import { timestampToMonth } from "../utils/datetime";
import { showGenres } from "../api/server";
import { users, showUUID } from "../api/storage";
import { ShowContext } from "../page/shows";


export function FullShowPreview({ show }){

    return (
        <div 
            className="size-fit rounded-lg bg-gray-800 p-5 flex gap-5 text-white"
        >
            <AsyncImage imgUrl={show.image} className="size-96 rounded-lg shrink-0"/>
            <div className="w-[400px]">
                <h6 className="text-2xl font-bold mb-4 text-center">{sanitizeHtmlLiterals(show.title)}</h6>
                <div className="flex justify-between">
                    <p>{show.seasons > 1 ? `${show.seasons} Seasons` : `${show.seasons} Season`}</p>
                    <p>{timestampToMonth(show.updated)}</p>
                </div>
                <div className="my-3 flex gap-4">
                    {
                        show.genres.map(genreID => {
                            return <p key={genreID} className="bg-purple-500 rounded-full px-2 py-1">{showGenres[genreID]}</p>
                        })
                    }
                </div>
                <p className="line-clamp-6">{show.description}</p>
                <div className="mt-5 flex justify-evenly">
                    <Link
                        to={`/show/${show.id}/season/1`}
                        className="rounded-full px-3 py-2 bg-gray-200 text-black"
                    >
                        Read More <i className="fas fa-arrow-right" />
                    </Link>
                </div>
            </div>
        </div>
    );
};


export function SmallShowPreview({ show }){

    return (
        <div 
            className="size-fit rounded-lg bg-gray-800 p-3 flex gap-5 text-white cursor-pointer"
        >
            <AsyncImage imgUrl={show.image} className="size-48 rounded-lg shrink-0"/>
            <div className="w-48">
                <h6 className="text-xl font-bold mb-4 line-clamp-2">{sanitizeHtmlLiterals(show.title)}</h6>
                <div className="flex justify-between">
                    <p>{show.seasons > 1 ? `${show.seasons} Seasons` : `${show.seasons} Season`}</p>
                </div>
                <div className="my-3 flex gap-2 flex-wrap">
                    {
                        show.genres.map(genreID => {
                            return <p key={genreID} className="bg-purple-500 rounded-full text-sm px-2 py-1 size-fit">{showGenres[genreID]}</p>
                        })
                    }
                </div>
            </div>
        </div>
    );
};


export function SmallerShowPreview({ show }){

    return (
        <div
            className="size-fit rounded-lg bg-gray-800 p-3 gap-3 text-white cursor-pointer grid grid-rows-[144px_36px] grid-cols-2"
        >
            <AsyncImage imgUrl={show.image} className="size-36 rounded-lg shrink-0"/>
            <div className="w-36 h-52 flex flex-col gap-4">
                <h6 className="text-xl font-bold line-clamp-2">{sanitizeHtmlLiterals(show.title)}</h6>
                <p>{show.seasons > 1 ? `${show.seasons} Seasons` : `${show.seasons} Season`}</p>
                <p className="text-sm"><span className="text-xs">Last Updated: </span>{timestampToMonth(show.updated)}</p>
            </div>
            <div className="col-span-2 my-3 flex gap-2 flex-wrap ">
                {
                    show.genres.map(genreID => {
                        return <p key={genreID} className="bg-purple-500 rounded-full text-xs px-2 py-1 size-fit line-clamp-1">{showGenres[genreID]}</p>
                    })
                }
            </div>
        </div>
    );
};


export function SmallGenrePreview({ genre }){

    return (
        <div className="relative w-72 h-52 bg-gray-800 rounded-lg">
            <AsyncImage imgUrl={genre.image} className="pt-2"/>
            <p className="absolute bottom-3 text-white text-xl font-bold text-wrap text-shadow px-3">{showGenres[genre.id]}</p>
        </div>
    );
};


export function ShowHeader({show}){

    return (
        <div className="text-white flex flex-col gap-5">
            <div className="flex flex-row ">
                <div className="w-48 shrink-0">
                    <AsyncImage
                        imgUrl={show.image}
                        className="size-48 rounded-lg border-2"
                    />
                    <div className="my-3 flex justify-evenly">
                        {
                            show.genres.map(genreID => {
                                return <p key={genreID} className="bg-purple-500 rounded-full p-2">{showGenres[genreID]}</p>
                            })
                        }
                    </div>
                </div>
                <div className="grow flex flex-col px-5">
                    <p className="max-h-60 overflow-y-auto p-4 rounded-lg bg-gray-900">{show.description}</p>
                </div>
            </div>
        </div>
    );
};


export function SeasonSelector({ seasonID }){
    const { show }= useContext(ShowContext);
    const sortedSeasons = show.seasons.sort((a, b)=> a.season > b.season);

    function selectSeason(pos){
        setActiveSeason(sortedSeasons[pos]);
    };

    return (
        <div>
            <h1>Seasons</h1>
            <ImageSlider >
                {sortedSeasons.map((el, index) => (
                    <Link
                        key={index}
                        to={`/show/${show.id}/season/${el.season}`}
                    >
                        <AsyncImage imgUrl={el.image} className="size-40 rounded-lg"/>
                    </Link>
                ))}
            </ImageSlider>

            <ShowContext.Provider value={{ show, seasonID }}>
                <EpisodeView episodes={
                    (show.seasons.find(el => el.season === parseInt(seasonID))).episodes
                } />
            </ShowContext.Provider>
        </div>
    );
};


function EpisodeView({ episodes }){
    const { show, seasonID } = useContext(ShowContext);

    return (
        <div className="w-full flex flex-row flex-wrap">
            {
                episodes.map((ep, index) => (
                    <Episode key={`${seasonID} ${index}`} ep={ep} />
                ))
            }
        </div>
    );
};


function Episode({ ep }){
    console.log("EPISODE::trigger")
    const { show, seasonID } = useContext(ShowContext);
    const { setActiveEpisode, userID } = useOutletContext();

    const userData = userID ? users.getUserData(userID) : null;
    let fav;
    let progress;
    if (userData !== null){
        fav = Object.keys(userData.favorites).includes(showUUID.get(show.id, seasonID, ep.episode));
        progress = parseFloat(userData.progress[showUUID.get(show.id, seasonID, ep.episode)]) * 100;
    };

    const [isFavorite, setIsFavorite] = useState(fav);

    function toggleFavorite(){
        const userData = users.getUserData(userID);
        console.log("toggle favs", userData)
        if (userData === null) return;

        if (isFavorite){
            delete userData.favorites[showUUID.get(show.id, seasonID, ep.episode)];
            users.updateData(userID, userData);
            setIsFavorite(false);
        } else {
            userData.favorites[showUUID.get(show.id, seasonID, ep.episode)] = {
                date: Date.now(),
                showTitle: show.title,
                episodeTitle: ep.title,
                imgUrl: show.seasons.find(el => el.season === parseInt(seasonID)).image
            };  // save basic data, to avoid retrieving entire show object later

            users.updateData(userID, userData);
            setIsFavorite(true);
        };
    };

    return (
        <div className="bg-gray-100 p-2 my-2 rounded">
            <p>Episode {ep.episode}</p>
            <p>{ep.title}</p>
            { userID ? isFavorite ?
                <BsStarFill className="fill-green-500" onClick={toggleFavorite} /> :
                <BsStar className="star " onClick={toggleFavorite} /> : null
            }
            <p>{ep.description}</p>
            <button
                onClick={()=>{
                    setActiveEpisode(
                        show.id,
                        seasonID,
                        ep.episode
                    );
                }}
            >Play</button>
            {progress ? <Progress key={progress} value={progress} size="sm"/> : null}
        </div>
    );
};