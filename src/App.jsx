import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";

import { MainLayout } from "./page/layouts";
import { LandingPage } from "./page/hero";

import { getPreviews } from "./api/server";


export const App = createHashRouter(
  createRoutesFromElements(
      <Route path="/" element={<MainLayout />} id="root" loader={async()=>{ return {previews:  getPreviews()}; }}>
        <Route index element={<LandingPage />} />
      </Route>
  )
);