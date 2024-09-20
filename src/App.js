import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Views/Dashboard/Dashboard'
import Tracker from './Views/Tracker/Tracker'
import Trackers from './Views/Tracker/Trackers'
import Navbar from './Shared/Navbar'
import Event from './Views/Event/Event'
import Home from './Views/Home/Home'
import PageNotFound from './Views/PageNotFound'
import Events from './Views/Event/Events'
import Settings from './Views/Settings'
import { useEffect } from 'react'

function App() {

    useEffect(() => {

        // Set initial color scheme
        const systemColorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        let userPreference = localStorage.getItem("settingColorScheme")

        // Remove the user preference if it matches the system color scheme (essentially, reverting to the system color scheme)
        if (systemColorScheme === userPreference) {
            localStorage.removeItem("settingColorScheme")
            userPreference = null
        }

        // Add the css classes that dicate the color scheme to the html element
        const html = document.querySelector("html")
        html.classList.remove(`theme-${(userPreference ?? systemColorScheme) === "dark" ? "light" : "dark"}`)
        html.classList.add(`theme-${(userPreference ?? systemColorScheme) === "dark" ? "dark" : "light"}`)
        
    }, [])

    return (
        <BrowserRouter>
            <div className="container">
                <Navbar />
                <section className="section">
                    <Routes>
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
    )
}

export default App
