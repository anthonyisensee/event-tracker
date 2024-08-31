// TODO: Add modal for delete confirmation and other purposes.
const Modal = ({ isActive }) => {
    
    return ( 
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    Content Here
                </section>
                <footer className="modal-card-foot">
                    <div className="buttons">
                        <button className="button is-success">Save changes</button>
                        <button className="button">Cancel</button>
                    </div>
                </footer>
            </div>
        </div>
    )
}
 
export default Modal