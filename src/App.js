import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Views/Dashboard/Dashboard";
import Tracker from "./Views/Tracker/Tracker";
import Trackers from "./Views/Tracker/Trackers";
import Navbar from "./Shared/Navbar";
import Event from "./Views/Event/Event";
import Home from "./Views/Home/Home";
import PageNotFound from "./Views/PageNotFound";
import Events from "./Views/Event/Events";
import Settings from "./Views/Settings";
import { useDarkMode } from "./Context/ThemeContext";
import "./App.css";

function App() {
  const { isDarkMode } = useDarkMode();

  return (
    <div className="app" data-theme={`${isDarkMode ? "dark" : "light"}`}>
      <BrowserRouter>
        <div className="container">
          <Navbar />
          <section className="section">
            <Routes >
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trackers" element={<Trackers />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event" element={<Event />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/*" element={<PageNotFound />} />
            </Routes>
          </section>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
