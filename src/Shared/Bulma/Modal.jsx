import { useState } from "react"

const Modal = ({ isActive, setIsActive, action, onAction, headerTitle, bodyContent, footerContent }) => {

    const isApprovedMode = ["save", "delete", "remove"].includes(action)
    const isDanger = ["delete", "remove"].includes(action)

    return ( 
        <div className={`modal ${isActive ? 'is-active' : ''}`}>
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">{headerTitle}</p>
                    <button onClick={() => setIsActive(false)} type="button" className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                    {!bodyContent &&
                        <div className="content">Are you certain?</div>
                    }
                    {bodyContent && 
                        bodyContent
                    }
                </section>
                <footer className="modal-card-foot">
                    {!footerContent &&
                        <div className="buttons is-right">
                            {!isApprovedMode &&
                                <button onClick={() => onAction()} type="button" className="button is-info">Confirm</button>
                            }
                            {isApprovedMode &&
                                <button onClick={() => onAction()} type="button" className={`button ${isDanger ? "is-danger" : "is-success"}`}>{action.charAt(0).toUpperCase() + action.slice(1)}</button>
                            }
                            <button onClick={() => setIsActive(false)} type="button" className="button">Cancel</button>
                        </div>
                    }
                    {footerContent && 
                        footerContent
                    }
                </footer>
            </div>
        </div>
    )
}
 
export default Modal