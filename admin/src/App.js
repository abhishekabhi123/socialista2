import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import AppList from "./pages/appList.jsx/AppList";
import { UserContext } from "./Store/UserContext";
import Report from "./pages/Report/Report";
function App() {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const { userDetails } = useContext(UserContext);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/">
          {user && (
            <>
              <Route index element={<Home />} />
              {/* <Route path="login" element={<Login />} /> */}

              <Route path="/users">
                <Route index element={<List />} />
                <Route path=":userId" element={<Single />} />
                <Route
                  path="new"
                  element={<New inputs={userInputs} title="Add New User" />}
                />
              </Route>
              <Route path="posts">
                <Route index element={<AppList />} />
                <Route path=":productId" element={<Single />} />
                <Route
                  path="new"
                  element={
                    <New inputs={productInputs} title="Add New Product" />
                  }
                />
              </Route>
              <Route path="reports">
                <Route index element={<Report />} />
              </Route>
            </>
          )}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
