import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <div className="content">
            <h1 className="is-size-4">The page you requested was not found.</h1> 
            <p>You may want to navigate to the <Link to="/">home page</Link>, visit the <Link to="/dashboard">dashboard</Link>, or <Link to="/tracker">create a tracker</Link>.</p>
        </div>
    )
}

export default PageNotFound
