import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {

    const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false)

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link onClick={() => setHamburgerIsOpen(false)} to="/" className="navbar-item">🏠 Home</Link>
                <button onClick={() => setHamburgerIsOpen(!hamburgerIsOpen)} className={`navbar-burger ${hamburgerIsOpen ? "is-active" : ""}`} aria-label="menu" aria-expanded={hamburgerIsOpen}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button>
            </div>
            <div onClick={() => setHamburgerIsOpen(false)} className={`navbar-menu ${hamburgerIsOpen ? "is-active" : ""}`}>
                <div className="navbar-start">
                    <Link to="/dashboard" className="navbar-item">📊 Dashboard</Link>
                    <Link to="/trackers" className="navbar-item">📅 Trackers</Link>
                    <Link to="/events" className="navbar-item">🔔 Events</Link>
                </div>
                <div className="navbar-end">
                    {/* <Link to="/settings" className="navbar-item">⚙️ Settings</Link> */}
                </div>
            </div>
        </nav>

    )
}

export default Navbar
