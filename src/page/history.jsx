import { Suspense, useState } from "react";
import { useRouteLoaderData, Await, useOutletContext, Link, replace } from "react-router-dom";

import { Progress, Button } from "@material-tailwind/react";
import { AsyncImage } from "../component/basic";

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
            <h4 className="text-white">History Page</h4>
            <Button
                onClick={clearHistory}
            >Clear History</Button>
            <Suspense>
                <Await resolve={previewsByIndex}
                    children={previewsByIndex => {
                        const userData = users.getUserData(userID);
                        let h = Object.entries(userData.history).sort((a, b) => a[0] < b[0] );


                        return (
                            h.map(el => {
                                const { showID, seasonID, episodeID } = showUUID.parse(el[1]);
                                const progress = userData.progress[el[1]];
                                return (
                                    <div key={clear} className="text-white p-3 bg-gray-700">
                                        <p>{timestampToDateTime(el[0])}</p>
                                        <p>{previewsByIndex[showID].title}</p>
                                        <AsyncImage imgUrl={previewsByIndex[showID].image} className="size-20"/>
                                        <p>Season {seasonID}</p>
                                        <p>Episode {episodeID}</p>
                                        {progress ? <Progress key={progress} value={parseFloat(progress) * 100} /> : null}
                                        <Link to={`/show/${showID}/season/${seasonID}`}>Go to..</Link>
                                    </div>
                                )
                            })
                        );
                    }}
                ></Await>
            </Suspense>
        </div>
    );
};