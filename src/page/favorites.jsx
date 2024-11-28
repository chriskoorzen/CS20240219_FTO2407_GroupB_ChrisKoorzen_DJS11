import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import { AsyncImage } from "../component/basic";

import { users, showUUID } from "../api/storage";


export function FavoritesPage(){
    const { userID } = useOutletContext();
    const [sortOption, setSortOption] = useState("By Show");       // "By Show", "A-Z", "Z-A", "Latest", "Oldest"

    // Do sorting
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
                // Destructure and build an indexed "show-id-episode-valuekey" object
                if (obj[showName]){
                    if (obj[showName][seasonID]){
                        obj[showName] = { ...obj[showName], [seasonID]: {...obj[showName][seasonID], [episodeID]: favorites[value]}};
                    }
                    else {
                        obj[showName] = { ...obj[showName] ,[seasonID]: {[episodeID]: favorites[value]}};
                    }
                } else {
                    obj[showName] = {[seasonID]: {[episodeID]: favorites[value]}};
                };
                return obj;
            }, new Object());
            break;
    };

    return (
        <div>
            <div>
                <button
                    className={`${sortOption==="By Show"? "bg-green-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("By Show")}}
                >By Show
                </button>
                <button
                    className={`${sortOption==="A-Z"? "bg-green-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("A-Z")}}
                >A-Z
                </button>
                <button
                    className={`${sortOption==="Z-A"? "bg-green-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("Z-A")}}
                >Z-A
                </button>
                <button
                    className={`${sortOption==="Latest"? "bg-green-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("Latest")}}
                >Latest
                </button>
                <button
                    className={`${sortOption==="Oldest"? "bg-green-300": ""} p-2 rounded`}
                    onClick={()=>{setSortOption("Oldest")}}
                >Oldest
                </button>
            </div>
            <div>
                { grouped ? 
                    Object.keys(grouped).map(show => {
                        return (
                            <div>
                                <p>{show}</p>
                                {Object.keys(grouped[show]).map(season => {
                                    return (
                                        <div>
                                            <p>Season {season}</p>
                                            {Object.keys(grouped[show][season]).map(episode => {
                                                return <div>
                                                    <p>Episode {episode}</p>
                                                    <p>{grouped[show][season][episode].episodeTitle}</p>
                                                    <p>{grouped[show][season][episode].date}</p>
                                                    <AsyncImage imgUrl={grouped[show][season][episode].imgUrl} className="size-20" />
                                                </div>
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                    
                    :

                    favorites.map(data => {
                        const {showID, seasonID, episodeID} = showUUID.parse(data[0]);
                        return (
                            <div className="p-2 bg-purple-300 m-2">
                                <p>{data[1].showTitle}</p>
                                <p>Season {seasonID}</p>
                                <p>Episode {episodeID}</p>
                                <p>{data[1].episodeTitle}</p>
                                <p>date added {new Date(data[1].date).toLocaleDateString(undefined, {year: "numeric",month: "short",day:"2-digit"})}</p>
                                <AsyncImage imgUrl={data[1].imgUrl} className="size-20" />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};