import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Trackers from './Views/Tracker/Trackers'
import Tracker from './Views/Tracker/Tracker'
import Navbar from './Shared/Navbar'
import CreateTracker from './Views/Tracker/CreateTracker'
import EditTracker from './Views/Tracker/EditTracker'
import CreateEvent from './Views/Event/CreateEvent'
import EditEvent from './Views/Event/EditEvent'

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <section className="section">
                    <Navbar />
                </section>
                <section className="section">
                    <Routes>

                        <Route path="/" element={<Trackers />} />
                        
                        <Route path="/tracker/:trackerId" element={<Tracker />} />
                        <Route path="/tracker/create" element={<CreateTracker />} />
                        <Route path="/tracker/edit/:trackerId" element={<EditTracker />} />
                        
                        <Route path="/event/create/:trackerId" element={<CreateEvent />} />
                        <Route path="/event/edit/:eventId" element={<EditEvent />} />

                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
