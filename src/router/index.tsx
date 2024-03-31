import { RouteObject, createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import ErrorPage from "@/pages/404";
import About from "@/pages/About";
import Shop from "@/pages/Shop";
import Login from "@/pages/Login";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export const router = createBrowserRouter(routes);
