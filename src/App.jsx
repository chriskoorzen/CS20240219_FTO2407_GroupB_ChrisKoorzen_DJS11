import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { MainLayout } from "./page/layouts";
import { LandingPage } from "./page/hero";
import { FullShowPage } from "./page/shows";
import { BrowsePage } from "./page/browse";
import { GenresPage } from "./page/genres";
import { FavoritesPage } from "./page/favorites";

import { loadInitialData } from "./api/server";


export const App = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<MainLayout />} id="root" loader={loadInitialData} shouldRevalidate={() => false}>
            <Route index element={<LandingPage />} />
            <Route path="browse/" element={<BrowsePage />} />
            <Route path="browse/genres/" element={<GenresPage />} />
            <Route path="show/:showID/season/:seasonID" element={<FullShowPage />} />
            <Route path=":user/favorites" element={<FavoritesPage />} />
        </Route>
    )
);