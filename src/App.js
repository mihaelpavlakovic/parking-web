// react imports
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// component imports
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoutes from "./routes/PrivateRoutes";

function App() {
  const cameraObj = useSelector(state => state.camera);
  console.log("App ~ cameraObj:", cameraObj);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/" exact />
          </Route>
          <Route element={<Login />} path="/login" />
          <Route element={<Login />} path="/register" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
