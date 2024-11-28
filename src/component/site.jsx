import { Suspense, useContext } from "react";
import { Link, useRouteLoaderData, Await } from "react-router-dom";

import {
    Navbar,
    Button,
    Typography,
    progress
} from "@material-tailwind/react";

import { AudioPlayer } from "../component/audioplayer";

import iconURL from "../asset/music.png";

import { users, showUUID } from "../api/storage";
import { AudioContext } from "../page/layouts";

import placeholderSound from "../dev/pitch.mp3"


export function SiteHeader({userLogOutFn}){

    return (
        <Navbar
            variant="gradient"
            color="blue-gray"
            className="from-gray-900 to-gray-800 px-5 py-2 h-16"
            fullWidth={true}
        >
            <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
                <Link to="/" className="flex items-center cursor-pointer ">
                    <img
                        className="size-12 bg-purple-500 rounded-xl p-1"
                        src={iconURL}
                    />
                    <Typography
                        variant="h6"
                        className="mx-3"
                    >
                        QCast
                    </Typography>
                </Link>

                <div className="flex gap-2">
                    <Button>Sign Up</Button>
                    <Button onClick={userLogOutFn}>Log Out</Button>
                </div>
            </div>
    </Navbar>
    );
};


export function SiteFooter(){
    const { userID, episode } = useContext(AudioContext);
    

    if (episode === null){
        return (
            <div className="h-16 w-full bg-lime-200">

            </div>
        );
    };
    const { showID, seasonID, episodeID } = episode;
    const { shows } = useRouteLoaderData("root");
    const userData = users.getUserData(userID);
    
    console.log("reload footer")

    return (
        <Suspense>
            <Await 
                resolve={shows[showID]} 
                children={show => {
                    console.log("awaited", seasonID, episodeID)
                    const season = show.seasons.find(el => el.season === parseInt(seasonID));
                    const episode = season.episodes.find(el => el.episode === parseInt(episodeID));
                    const url = episode.file;

                    let pro = 0;
                    if (userData !== null){
                        pro = userData.progress[showUUID.get(showID, seasonID, episodeID)];
                        pro = !pro ? 0 : parseInt(pro); // if undefined or null, make zero, else get progress
                    };

                    // let isFav = Object.keys(userData.favorites).includes(showUUID.get(showID, seasonID, episodeID));

                    return (
                        <div className="h-16 w-full bg-gray-900 flex flex-row">
                            <Link to={`/show/${showID}/season/${seasonID}`} className="block w-1/2 h-full">
                                <div className="size-full px-4 flex flex-col justify-center">
                                    <div className="text-white flex flex-row justify-between">
                                        <p className="font-bold">{show.title}</p>
                                        <p>Season {seasonID}</p>
                                    </div>
                                    <div className="text-white flex flex-row">
                                        <p className="pr-10 text-nowrap">Episode {episodeID}</p>
                                        <p className="grow line-clamp-1 overflow-x-hidden text-nowrap">{episode.title}</p>
                                    </div>
                                </div>
                            </Link>
                            <AudioPlayer audio={{URL: url, progress: pro}} />
                        </div>
                    )
                }}>
            </Await>
        </Suspense>
    );
};
