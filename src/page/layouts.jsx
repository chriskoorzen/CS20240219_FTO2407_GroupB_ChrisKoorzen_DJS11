import { useState, createContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { SiteHeader, SiteFooter } from "../component/site";
import { DashBoard } from "../component/navigation";

import { users, showUUID } from "../api/storage";

export const AudioContext = createContext(null);


export function MainLayout(){
    const [userID, setUserID] = useState(users.findLoggedInUser());
    const [episode, setEpisode] = useState(null);
    const navigate = useNavigate();
    console.log("LAYOUTS::trigger:: user is", userID)

    function logUserOut(){
        if (users.logOut(userID)){
            setUserID(false);
            navigate("/");
        };
    };

    function setActiveEpisode(showID, seasonID, episodeID){
        console.log(`LAYOUTS::setActiveEpisode:: Selected show ${showID}, season ${seasonID}, ep ${episodeID}`)
        setEpisode(
            {showID, seasonID, episodeID}
        );

        // Add to history stack
        const userData = users.getUserData(userID);
        if (userData){
            userData.history[Date.now()] = showUUID.get(showID, seasonID, episodeID);
            users.updateData(userID, userData);
        };
    };

    return (
        <div className="size-full flex flex-col justify-between bg-gray-800">
            <SiteHeader userLogOutFn={logUserOut} userID={userID} setUserID={setUserID}/>

            <div className="grow grid grid-cols-[360px_minmax(900px,_1fr)] gap-3">    
                <div className="bg-gray-900 rounded-lg my-3 ml-3">
                    <DashBoard userID={userID} setUserID={setUserID}/>
                </div>
                <div className="grow relative">
                    <div className="absolute inset-0 overflow-y-auto rounded-lg bg-gray-900 my-3 mr-3 p-4">
                        <Outlet key={userID} context={{ userID, setActiveEpisode }}/>
                    </div>
                </div>
            </div>

            <AudioContext.Provider value={{ episode, userID }}>
                <SiteFooter />
            </AudioContext.Provider>
        </div>
    );
};
