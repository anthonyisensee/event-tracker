import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Views/Dashboard/Dashboard'
import Tracker from './Views/Tracker/Tracker'
import Trackers from './Views/Tracker/Trackers'
import Navbar from './Shared/Navbar'
import Event from './Views/Event/Event'
import Home from './Views/Home/Home'
import PageNotFound from './Views/PageNotFound'
import Events from './Views/Event/Events'

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <Navbar />
                <section className="section">
                    <Routes>
                        <Route path="/" element={<Home />} title="Test"/>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tracker" element={<Tracker />} />
                        <Route path="/trackers" element={<Trackers />} />
                        <Route path="/event" element={<Event />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/settings" element={<p>Settings page coming soon to fulfill all your customization wishes!</p>} />
                        
                        <Route path="/*" element={<PageNotFound />} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
