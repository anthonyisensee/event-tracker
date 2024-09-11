import { Link } from "react-router-dom"

const Home = () => {

    return (
        <div className="content">
            <h1>Event Tracker</h1>
            <p>Event tracker is the modern equivalent of the "It has been <span className="is-underlined">&nbsp;X&nbsp;</span> days since the last accident" whiteboard. It is designed to be a multipurpose tool to help you track, view, and visualize both the time since events have occurred as well as the frequency of those events.</p>
            <Link to="/tracker" className="button is-success">Create a Tracker</Link>
        </div>
    )

}

export default Home
