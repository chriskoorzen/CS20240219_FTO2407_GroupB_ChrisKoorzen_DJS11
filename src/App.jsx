import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

import { MainLayout, LoginRequired } from "./page/layouts";
import { LandingPage } from "./page/hero";
import { FullShowPage } from "./page/shows";
import { BrowsePage } from "./page/browse";
import { GenresPage } from "./page/genres";
import { FavoritesPage } from "./page/favorites";
import { HistoryPage } from "./page/history";
import { MainErrorPage, RouteNotFound } from "./page/error";

import { loadInitialData } from "./api/server";


export const App = createBrowserRouter(
    createRoutesFromElements(
        <Route
            path="/"
            element={<MainLayout />}
            id="root"
            loader={loadInitialData}
            shouldRevalidate={() => false}
            errorElement={<MainErrorPage />}
        >
            <Route path="*" element={<RouteNotFound />}/>
            <Route index element={<LandingPage />} />
            <Route path="browse/" element={<BrowsePage />} />
            <Route path="browse/genres/" element={<GenresPage />} />
            <Route path="show/:showID/season/:seasonID" element={<FullShowPage />} />
            <Route element={<LoginRequired />}>
                <Route path=":user/favorites" element={<FavoritesPage />} />
                <Route path=":user/history" element={<HistoryPage />} />
            </Route>
        </Route>
    )
);