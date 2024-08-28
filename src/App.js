import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Services from './Views/Services/Services'
import Service from './Views/Services/Service'
import Navbar from './Shared/Navbar'
import CreateService from './Views/Services/CreateService'
import EditService from './Views/Services/EditService'

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
                        <Route path="/service/create" element={<CreateService />} />
                        <Route path="/service/edit" element={<EditService />} />
                        <Route path="/event/create" element={<p>I'm the create event component.</p>} />
                        <Route path="/event/edit" element={<p>I'm the edit event component.</p>} />
                    </Routes>
                </section>
            </div>
        </BrowserRouter>
    )
}

export default App
