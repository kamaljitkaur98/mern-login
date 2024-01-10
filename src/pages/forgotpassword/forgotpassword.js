
import './forgotpassword.css';
import React, { useState } from 'react';

{/* 
    Will design a very simple form that can update user's password
    based on OTP sent to their gmail account
*/}

function ForgotPassword() {

    const [email,setEmail] = useState("")
    const [message, setMessage] = useState(null)

    const handleSubmit = async () => {
        console.log(email)
        const request = await fetch('/api/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email: email
            }),
            headers: {
              'Content-Type' : 'application/json'
            }
        })

        const response = await request.json();
        setMessage(response.message)
        setEmail("")
    }

    return(
        <>
            <div className="main-container">
                <div className="form-container">
                    <h3> Want to reset your password ?</h3>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <div className="form-group">
                        <input type="email" 
                            className="form-control mt-4" 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp" 
                            placeholder="Email" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Log In</button>
                    </form>
                    {
                        message ? (
                            <div>
                                <p className="alert-text">{message}</p>
                            </div>
                        ) : <></>
                    }
                </div>  
            </div>
        </>
    )
}


export default ForgotPassword;