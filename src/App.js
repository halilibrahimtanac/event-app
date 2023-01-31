import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/UI/Navbar";
import Auth, { userInformationsHelper } from "./pages/Auth";
import EditProfile from "./pages/EditProfile";
import Event from "./pages/Event";
import Home from "./pages/Home";
import MyChats from "./pages/MyChats";
import NewEvent from "./pages/NewEvent";
import Profile from "./pages/Profile";
import Report from "./pages/Report";
import User from "./pages/User";

function App() {
  const dispatch = useDispatch();
  const { isLogged, user } = useSelector((state) => state.auth);
  const [routes, setRoutes] = useState();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      userInformationsHelper(JSON.parse(user), dispatch);
    }
  }, []);

  useEffect(() => {
    if (isLogged) {
      return setRoutes(
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/chat" element={<MyChats />} />
          <Route path="/user/:uid" element={<User />} />
          <Route path="/new-event" element={<NewEvent />} />
          {user.userType === "admin" && (
            <Route path="/report" element={<Report />} />
          )}
        </Routes>
      );
    }
    setRoutes(
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="user/:uid" element={<User />} />
      </Routes>
    );
  }, [isLogged]);
  return (
    <div className="App">
      <BrowserRouter>
        {isLogged && <Navbar />}
        {routes}
      </BrowserRouter>
    </div>
  );
}

export default App;
