// import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {

    // const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false)

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <Link to="/" className="navbar-item">Trackers</Link>
                {/* <button onClick={() => setHamburgerIsOpen(!hamburgerIsOpen)} role="button" className={`navbar-burger ${hamburgerIsOpen ? "is-active" : ""}`} aria-label="menu" aria-expanded={hamburgerIsOpen}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </button> */}
            </div>
            {/* <div className="navbar-menu">
                <div className="navbar-start">
                    <a className="navbar-item">
                        Additional Navbar Item
                    </a>
                </div>
            </div> */}
        </nav>

    )
}

export default Navbar
