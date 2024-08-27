import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Services from './Views/Services/Services';
import Service from './Views/Services/Service';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Services/>}/>
                <Route path="/service" element={<Service/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
