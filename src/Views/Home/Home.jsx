import { Link } from "react-router-dom"

const Home = () => {

    return (
        <div className="content">
            <h1>Event Tracker</h1>
            <p>Event tracker is the modern equivalent of the "It has been <span className="is-underlined">&nbsp;X&nbsp;</span> days since the last accident" whiteboard. It is designed to help you easily visualize the time since an event has occurred by allowing you to create custom trackers and log events against them.</p>
            <p>Get started by <Link to="/tracker">creating a tracker</Link> or visiting <Link to="/dashboard">the dashboard</Link>.</p>
        </div>
    )

}

export default Home
