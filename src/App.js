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
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/tracker" element={<Tracker />} />
                        <Route path="/event" element={<Event />} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
