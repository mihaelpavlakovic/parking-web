// react imports
import { BrowserRouter, Route, Routes } from "react-router-dom";

// component imports
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivateRoutes from "./routes/PrivateRoutes";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Profile />} path="/profile" />
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
