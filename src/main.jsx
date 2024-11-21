import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";
import './input.css';

import { App } from './App.jsx';

createRoot(document.getElementById('root')).render(
  <RouterProvider router={App} />
);