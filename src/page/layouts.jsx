import { useState } from "react";
import { Outlet, useOutletContext, NavLink } from "react-router-dom";

import { SiteHeader } from "../component/site";
import { AudioPlayer } from "../component/audioplayer";
import { DashBoard } from "../component/user";

import { users } from "../api/storage";


export function MainLayout(){
    const [userID, setUserID] = useState(users.findLoggedInUser());

    function logUserOut(){
        console.log("layouts logout", userID)
        if (users.logOut(userID)){
            setUserID(false);
        };
    };

    return (
        <div className="size-full flex flex-col justify-between bg-gray-900">
            <SiteHeader userLogOutFn={logUserOut}/>

            <div className="grow grid grid-cols-[360px_minmax(900px,_1fr)] gap-3">    
                <div className="bg-gray-800 rounded-lg my-3 ml-3">
                    <DashBoard userID={userID} setUserID={setUserID}/>
                </div>
                <div className="grow relative">
                    <div className="absolute inset-0 overflow-y-auto rounded-lg bg-gray-800 my-3 mr-3 p-4">
                        <Outlet context={{ userID }}/>
                    </div>
                </div>
            </div>

            <AudioPlayer />
        </div>
    );
};
