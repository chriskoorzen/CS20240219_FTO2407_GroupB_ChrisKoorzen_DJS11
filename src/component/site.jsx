import { Suspense, useContext } from "react";
import { Link, useRouteLoaderData, Await } from "react-router-dom";

import { Navbar, Button, Typography } from "@material-tailwind/react";

import { AudioPlayer } from "../component/audioplayer";
import { SignUp } from "./user";

import iconURL from "../asset/music.png";

import { users, showUUID } from "../api/storage";
import { getShowInfo } from "../api/server";
import { sanitizeHtmlLiterals } from "../utils/strings";
import { AudioContext } from "../page/layouts";


export function SiteHeader({ userLogOutFn, setUserID, userID }){

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

                {userID ? 
                    <div className="flex gap-5 items-center">
                        <h1 className="font-bold text-lg">Welcome, {users.getUserCredentials(userID).name}</h1>
                        <Button onClick={userLogOutFn}>Log Out</Button>
                    </div>
                    :
                    <SignUp setUserID={setUserID}/>
                }
            </div>
    </Navbar>
    );
};


export function SiteFooter(){
    const { userID, episode } = useContext(AudioContext);
    
    // console.log("FOOTER::trigger::")
    if (episode === null){
        return (
            <div className="h-16 w-full bg-gray-900 flex items-center justify-center">
                <p className="text-white text-lg ">&copy; QCast Podcasts. All rights reserved.</p>
            </div>
        );
    };
    const { showID, seasonID, episodeID } = episode;
    const { shows } = useRouteLoaderData("root");
    if (!shows[showID]){    // Load data if not exists
        shows[showID] = getShowInfo([showID]);
    };

    return (
        <Suspense>
            <Await resolve={shows[showID]}>
                {show => {
                    console.log("FOOTER::awaited", seasonID, episodeID, show)
                    const season = show.seasons.find(el => el.season === parseInt(seasonID));
                    const episode = season.episodes.find(el => el.episode === parseInt(episodeID));
                    const url = episode.file;

                    const userData = users.getUserData(userID);
                    let pro = 0;
                    if (userData !== null){
                        pro = userData.progress[showUUID.get(showID, seasonID, episodeID)];
                        pro = !pro ? 0 : parseFloat(pro); // if undefined or null, make zero, else get progress
                        // console.log("progresSION", pro)
                    };

                    return (
                        <div className="h-16 w-full bg-gray-900 flex flex-row">
                            <Link to={`/show/${showID}/season/${seasonID}`} className="block w-1/2 h-full">
                                <div className="size-full px-4 flex flex-col justify-center">
                                    <div className="text-white flex flex-row justify-between">
                                        <p className="font-bold">{sanitizeHtmlLiterals(show.title)}</p>
                                        <p>Season {seasonID}</p>
                                    </div>
                                    <div className="text-white flex flex-row">
                                        <p className="pr-10 text-nowrap">Episode {episodeID}</p>
                                        <p className="grow line-clamp-1 overflow-x-hidden text-nowrap">{episode.title}</p>
                                    </div>
                                </div>
                            </Link>
                            <AudioPlayer audioUrl={url} progress={pro} autoplay={true}/>
                        </div>
                    )
                }}
            </Await>
        </Suspense>
    );
};
