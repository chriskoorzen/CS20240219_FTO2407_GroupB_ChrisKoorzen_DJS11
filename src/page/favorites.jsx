import { useState } from "react";
import { useOutletContext, Link } from "react-router-dom";

import { Progress } from "@material-tailwind/react";
import { AsyncImage } from "../component/basic";

import { users, showUUID } from "../api/storage";
import { timestampToDateTime } from "../utils/datetime";


export function FavoritesPage(){
    const { userID, setActiveEpisode } = useOutletContext();
    const [sortOption, setSortOption] = useState("By Show");       // "By Show", "A-Z", "Z-A", "Latest", "Oldest"

    // Do sorting
    const progress = users.getUserData(userID).progress;
    let favorites = Object.entries(users.getUserData(userID).favorites);
    let grouped;
    switch (sortOption){
        case "A-Z":
            favorites = favorites
                .toSorted((a, b)=> (a[1].showTitle + a[1].episodeTitle) > (b[1].showTitle + b[1].episodeTitle));
            break;
        case "Z-A":
            favorites = favorites
                .toSorted((a, b)=> (a[1].showTitle + a[1].episodeTitle) < (b[1].showTitle + b[1].episodeTitle));
            break;
        case "Latest":
            favorites = favorites.toSorted((a, b)=> parseInt(a[1].date) < parseInt(b[1].date));
            break;
        case "Oldest":
            favorites = favorites.toSorted((a, b)=> parseInt(a[1].date) > parseInt(b[1].date));
            break;
        case "By Show":
            favorites = users.getUserData(userID).favorites;
            grouped = Object.keys(favorites).reduce((obj, value)=>{
                const {showID, seasonID, episodeID} = showUUID.parse(value);
                const showName = favorites[value].showTitle;
                const favData = favorites[value];
                favData.showID = showID;
                // Destructure and build an indexed "showName-seasonId-episodeID-Favorite" object
                if (obj[showName]){
                    if (obj[showName][seasonID]){
                        obj[showName] = { ...obj[showName], [seasonID]: {...obj[showName][seasonID], [episodeID]: favData}};
                    }
                    else {
                        obj[showName] = { ...obj[showName] ,[seasonID]: {[episodeID]: favData}};
                    }
                } else {
                    obj[showName] = {[seasonID]: {[episodeID]: favData}};
                };
                return obj;
            }, new Object());
            break;
    };

    return (
        <div className="">
            <h1 className="text-white text-2xl font-bold mb-6">Your Favorite Shows</h1>
            <div className="text-white">
                <button
                    className={`${sortOption==="By Show"? "bg-purple-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("By Show")}}
                >By Show
                </button>
                <button
                    className={`${sortOption==="A-Z"? "bg-purple-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("A-Z")}}
                >A-Z
                </button>
                <button
                    className={`${sortOption==="Z-A"? "bg-purple-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("Z-A")}}
                >Z-A
                </button>
                <button
                    className={`${sortOption==="Latest"? "bg-purple-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("Latest")}}
                >Latest
                </button>
                <button
                    className={`${sortOption==="Oldest"? "bg-purple-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("Oldest")}}
                >Oldest
                </button>
            </div>
            <div>
                { grouped ? 
                    Object.keys(grouped).map(show => {
                        return (
                            <fieldset className="text-white border-2 border-gray-700/20 p-4 rounded-lg flex flex-row gap-3 my-6">
                                <legend className="text-2xl font-bold mx-3">{show}</legend>
                                {Object.keys(grouped[show]).map(season => {
                                    return (
                                        <fieldset className="border-2 px-3 py-2 border-gray-700/30 rounded-lg flex flex-col">
                                            <legend className="font-bold">Season {season}</legend>
                                            {Object.keys(grouped[show][season]).map(episode => {
                                                let progress = users.getUserData(userID).progress[showUUID.get(grouped[show][season][episode].showID, season, episode)];
                                                if (progress){
                                                    progress = parseInt(parseFloat(progress) * 100)
                                                };
                                                return (
                                                <div className="bg-gray-800 rounded-lg m-1 p-3">
                                                    <p className="font-bold">{grouped[show][season][episode].episodeTitle}</p>
                                                    <p>Episode {episode}</p>
                                                    <p className="text-purple-300 text-sm my-1">Added: {timestampToDateTime(grouped[show][season][episode].date)}</p>
                                                    <div className="w-full flex items-center justify-between mb-3">
                                                        <AsyncImage imgUrl={grouped[show][season][episode].imgUrl} className="size-20 rounded-lg" />
                                                        <button
                                                            className="size-fit mr-3 px-2 py-1 rounded-lg bg-gray-900"
                                                            onClick={()=>{setActiveEpisode(
                                                                grouped[show][season][episode].showID,
                                                                season,
                                                                episode
                                                            )}}
                                                        ><i className="fas fa-play" /> Play Now</button>
                                                    </div>
                                                    
                                                    {progress ? (<Progress value={progress} color="purple" size="sm"/>) : null}
                                                </div>)
                                            })}
                                        </fieldset>
                                    );
                                })}
                            </fieldset>
                        );
                    })
                    
                    :

                    favorites.map(data => {
                        const {showID, seasonID, episodeID} = showUUID.parse(data[0]);
                        let audioProgress = progress[data[0]];
                        if (audioProgress){
                            audioProgress = parseInt(parseFloat(audioProgress) * 100)
                        };
                        return (
                            <div className="p-2 bg-gray-800 rounded-lg m-2 text-white flex justify-between max-w-[800px]">
                                <div className="grow flex flex-col justify-evenly">
                                    <p className="font-bold">{data[1].showTitle}</p>
                                    <div className="w-full flex justify-between">
                                        <p>{data[1].episodeTitle}</p>
                                        <button
                                            className="mr-3 px-2 py-1 rounded-lg bg-gray-900"
                                            onClick={()=>{setActiveEpisode(showID, seasonID, episodeID)}}
                                        ><i className="fas fa-play" /> Play Now</button>
                                    </div>
                                    <div className="flex">
                                        <p className="mr-5">Season {seasonID}</p>
                                        <p>Episode {episodeID}</p>
                                    </div>
                                    <p className="text-sm text-purple-300">Added {timestampToDateTime(data[1].date)}</p>
                                    {audioProgress ? 
                                        (<div className="flex items-center">
                                            <Progress value={audioProgress} color="purple" size="sm" className="w-4/5"/>
                                            <p className="ml-6">{audioProgress} %</p>
                                        </div>
                                        )
                                    :
                                        null
                                    }
                                </div>
                                <AsyncImage imgUrl={data[1].imgUrl} className="size-28 rounded-lg" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};