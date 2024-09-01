import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Trackers from './Views/Tracker/Trackers'
import Tracker from './Views/Tracker/Tracker'
import Navbar from './Shared/Navbar'
import CreateTracker from './Views/Tracker/CreateTracker'
import EditTracker from './Views/Tracker/EditTracker'

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
                        <Route path="/tracker/:id" element={<Tracker />} />
                        <Route path="/tracker/create" element={<CreateTracker />} />
                        <Route path="/tracker/edit/:id" element={<EditTracker />} />
                        <Route path="/event/create" element={<p>I'm the create event component.</p>} />
                        <Route path="/event/edit" element={<p>I'm the edit event component.</p>} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
