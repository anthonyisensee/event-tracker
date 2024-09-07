import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './Views/Dashboard/Dashboard'
import Tracker from './Views/Tracker/Tracker'
import Navbar from './Shared/Navbar'
import CreateTracker from './Views/Tracker/CreateTracker'
import EditTracker from './Views/Tracker/EditTracker'
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
                        
                        <Route path="/tracker/:trackerId" element={<Tracker />} />
                        <Route path="/tracker/create" element={<CreateTracker />} />
                        <Route path="/tracker/edit/:trackerId" element={<EditTracker />} />
                        
                        <Route path="/event" element={<Event />} />
                        
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
