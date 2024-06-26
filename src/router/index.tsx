import { RouteObject, createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import ErrorPage from "@/pages/404";
import Shop from "@/pages/Shop";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard/index";
import Result from "@/pages/Result";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/shop",
    element: <Shop />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/result",
    element: <Result />,
  },
];

export const router = createBrowserRouter(routes);
