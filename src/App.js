// react imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";

// component imports
import router from "./routes/router";
import { getUserData } from "./store/user/userActions";

function App() {
  const token = JSON.parse(localStorage.getItem("token"));
  const userState = useSelector(state => state.user);
  const dispatch = useDispatch();
  console.log("App ~ userState:", userState);

  useEffect(() => {
    if (token) {
      dispatch(getUserData(token));
    }
  }, [token, dispatch]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
