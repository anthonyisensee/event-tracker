import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Services from './Views/Services/Services'
import Service from './Views/Services/Service'
import Navbar from './Shared/Navbar'

function App() {
    return (
        <BrowserRouter>
            <div className="container">
                <section className="section">
                    <Navbar />
                </section>
                <section className="section">
                    <Routes>
                        <Route path="/" element={<Services />} />
                        <Route path="/service" element={<Service />} />
                        <Route path="/service/create" element={<p>I'm the create service component.</p>} />
                        <Route path="/service/edit" element={<p>I'm the edit service component.</p>} />
                        <Route path="/event/create" element={<p>I'm the create event component.</p>} />
                        <Route path="/event/edit" element={<p>I'm the edit event component.</p>} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
