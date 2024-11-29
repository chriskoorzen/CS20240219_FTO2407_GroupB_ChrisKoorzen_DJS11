import { Suspense, useState } from "react";
import { useRouteLoaderData, Await, useOutletContext, Link, replace } from "react-router-dom";

import { Progress, Button } from "@material-tailwind/react";
import { AsyncImage } from "../component/basic";
import { LoadingSpinner } from "../component/loaders";

import { users, showUUID } from "../api/storage";
import { timestampToDateTime } from "../utils/datetime";


export function HistoryPage(){
    const { previewsByIndex } = useRouteLoaderData("root");
    const { userID } = useOutletContext();
    const [ clear, setClear ] = useState(false);

    function clearHistory(){
        const data = users.getUserData(userID);
        data.history = {};
        users.updateData(userID, data);
        setClear(true);
    };

    return (
        <div>
            <div className="w-full flex justify-between items-center mb-6">
                <h4 className="text-white text-2xl font-bold">History Page</h4>
                <Button
                    className="bg-purple-400"
                    onClick={clearHistory}
                >Clear History</Button>
            </div>
            <Suspense fallback={<LoadingSpinner loadingText={"History"}/>}>
                <Await resolve={previewsByIndex}>
                    {previewsByIndex => {
                        const userData = users.getUserData(userID);
                        let h = Object.entries(userData.history).sort((a, b) => a[0] < b[0] );

                        if(!h.length) return (
                            <p className="text-gray-600 font-bold text-xl">Nothing here yet.</p>
                        );

                        return (
                            h.map(el => {
                                const { showID, seasonID, episodeID } = showUUID.parse(el[1]);
                                const progress = userData.progress[el[1]];
                                return (
                                    <div key={clear} className="text-white p-3 bg-gray-800 rounded-lg m-2 w-96">
                                        <p className="text-lg font-bold">{previewsByIndex[showID].title}</p>
                                        <div className="flex items-center">
                                            <p className="mr-6">Season {seasonID}</p>
                                            <p>Episode {episodeID}</p>
                                        </div>
                                        <p className="text-purple-300">Last listened: {timestampToDateTime(el[0])}</p>
                                        <div className="flex w-full justify-between items-center">
                                            <AsyncImage imgUrl={previewsByIndex[showID].image} className="size-20 rounded-lg"/>
                                            <Link to={`/show/${showID}/season/${seasonID}`} className="bg-gray-900 py-1 px-2 rounded-lg mr-10">Go to..</Link>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            {progress ? <Progress key={progress} value={parseFloat(progress) * 100} color="purple" size="sm" className="w-4/5"/> : null}
                                            {progress ? (<p>{parseInt(parseFloat(progress) * 100)}%</p>) : null}
                                        </div>
                                    </div>
                                )
                            })
                        );
                    }}

                </Await>
            </Suspense>
        </div>
    );
};