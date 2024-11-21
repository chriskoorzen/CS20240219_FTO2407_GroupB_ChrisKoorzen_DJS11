import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";


export const App = createHashRouter(
  createRoutesFromElements(
      <Route path="/" element={<h1>Podcast App</h1>} />
  )
);