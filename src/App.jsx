import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { MainLayout } from "./page/layouts";
import { LandingPage } from "./page/hero";
import { FullShowPage } from "./page/shows";
import { BrowsePage } from "./page/browse";

import { loadInitialData } from "./api/server";


export const App = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />} id="root" loader={loadInitialData}>
            <Route index element={<LandingPage />} />
            <Route path="browse/" element={<BrowsePage />} />
            <Route path="show/:showid/" element={<FullShowPage />}>

            </Route>
        </Route>
    )
);