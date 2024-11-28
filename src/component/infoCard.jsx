import { useState, useContext } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { BsStar, BsStarFill } from "react-icons/bs";

import { AsyncImage, ImageSlider } from "./basic";

import { sanitizeHtmlLiterals } from "../utils/strings";
import { showGenres } from "../api/server";
import { ShowContext } from "../page/shows";
import { users, showUUID } from "../api/storage";


export function FullShowPreview({ show }){

    if (show === null){
        return <h1>Placeholder</h1>
    };

    return (
        <div 
            className="rounded-lg bg-gray-900 p-3 flex gap-5 text-white cursor-pointer"
        >
            <AsyncImage imgUrl={show.image} className="size-96 rounded-lg shrink-0"/>
            <div>
                <h6 className="text-2xl font-bold mb-4">{sanitizeHtmlLiterals(show.title)}</h6>
                <div className="flex justify-between">
                    <p>{show.seasons > 1 ? `${show.seasons} Seasons` : `${show.seasons} Season`}</p>
                    <p>{new Date(show.updated).toLocaleDateString(undefined, {year: "numeric",month: "short"})}</p>
                </div>
                <div className="my-3 flex gap-5">
                    {
                        show.genres.map(genreID => {
                            return <p key={genreID} className="bg-purple-500 rounded-full p-2">{showGenres[genreID]}</p>
                        })
                    }
                </div>
                <p className="line-clamp-6">{show.description}</p>
                <div className="mt-5 flex justify-evenly">
                    <Link
                        to={`/show/${show.id}/season/1`}
                        className="rounded-full p-3 bg-gray-200 text-black"
                    >
                        Read More..
                    </Link>
                    <button className="rounded-full bg-green-400 p-3">Play Now</button>
                </div>
            </div>
        </div>
    );
};


export function FullShowHeader({show}){

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
                    {/* <h6 className="text-center text-5xl font-bold mb-4">{sanitizeHtmlLiterals(show.title)}</h6>
                    <div className="my-3 flex justify-evenly">
                        {
                            show.genres.map(genreID => {
                                return <p key={genreID} className="bg-purple-500 rounded-full p-2">{showGenres[genreID]}</p>
                            })
                        }
                    </div> */}
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
    const { show, seasonID } = useContext(ShowContext);
    const { setActiveEpisode, userID } = useOutletContext();

    let userData = users.getUserData(userID);
    let fav = false;
    if (userData !== null){
        fav = Object.keys(userData.favorites).includes(showUUID.get(show.id, seasonID, ep.episode));
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
                imgUrl: show.image
            };  // save basic data, to avoid retrieving entire show object later

            users.updateData(userID, userData);
            setIsFavorite(true);
        };
    };

    return (
        <div className="bg-gray-100 p-2 my-2 rounded">
            <p>Episode {ep.episode}</p>
            <p>{ep.title}</p>
            {isFavorite ?
                <BsStarFill className="fill-green-500" onClick={toggleFavorite} /> :
                <BsStar className="star " onClick={toggleFavorite} />
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
        </div>
    );
};