// react imports
import { createBrowserRouter } from "react-router-dom";

// component imports
import Login from "../pages/Login";
import Error from "../pages/Error";
import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/register",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/",
    element: <Dashboard />,
    errorElement: <Error />,
  },
]);

export default router;
