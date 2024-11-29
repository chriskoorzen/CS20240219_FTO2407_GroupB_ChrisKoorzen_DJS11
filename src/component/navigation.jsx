import { useState, useRef, Suspense } from "react";
import { useRouteLoaderData } from "react-router";
import { Link } from "react-router-dom";
import {
    Button,
    Checkbox,
    Dialog,
    Card,
    CardBody,
    CardFooter,
    Typography,
    Input
} from "@material-tailwind/react";

import { AsyncImage } from "./basic";

import { users, showUUID } from "../api/storage";
import { getShowInfo } from "../api/server";


export function DashBoard({userID, setUserID}){

    return (
        <div className="size-full flex justify-center items-center">
            <UserArea userID={userID} />
        </div>
    );
};


export function UserArea({ userID }){
    const { shows } = useRouteLoaderData("root");
    const userData = users.getUserData(userID);

    return (
        <div className="size-full p-3 text-white flex flex-col">
            <Link to="/">Home Page</Link>
            <Link to="/browse">Browse All</Link>
            <Link to="/browse/genres/">Browse Genres</Link>
            { userID ?
                <>
                <Link to={`/${userID}/favorites`}>Favorites</Link>
                <Link to={`/${userID}/history`}>History</Link>
                </>
            :
                <h1 className="text-white font-bold mt-5">Log In To See Your Favorite Shows</h1>
            }
        </div>
    );
};