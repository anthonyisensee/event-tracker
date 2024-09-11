import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Views/Dashboard/Dashboard'
import Tracker from './Views/Tracker/Tracker'
import Navbar from './Shared/Navbar'
import Event from './Views/Event/Event'

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <section className="section">
                    <Navbar />
                </section>
                <section className="section">
                    <Routes>
                        <Route path="/" element={<p>This will be the home page.</p>} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/tracker" element={<Tracker />} />
                        <Route path="/trackers" element={<p>This will be the trackers page.</p>} />
                        <Route path="/event" element={<Event />} />
                        <Route path="/events" element={<p>This will be the events page.</p>} />
                        <Route path="/settings" element={<p>This will be the settings page.</p>} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
