import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Services from './Services';


function App() {
    return (
        <BrowserRouter>
            <div className="section">
                <Routes>
                    <Route path="/" element={<Services />}/>
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
