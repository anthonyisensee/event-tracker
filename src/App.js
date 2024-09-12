import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './Views/Dashboard/Dashboard'
import Tracker from './Views/Tracker/Tracker'
import Navbar from './Shared/Navbar'
import Event from './Views/Event/Event'
import Home from './Views/Home/Home'
import PageNotFound from './Views/PageNotFound'

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
                        <Route path="/trackers" element={<p>Trackers page coming soon! For now, create new trackers from the <Link to="/dashboard">dashboard</Link>.</p>} />
                        <Route path="/event" element={<Event />} />
                        <Route path="/events" element={<p>Events page coming soon! For now, create trackers and events from the <Link to="/dashboard">dashboard</Link>.</p>} />
                        <Route path="/settings" element={<p>Settings page coming soon to fulfill all your customization wishes!</p>} />
                        
                        <Route path="/*" element={<PageNotFound />} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
