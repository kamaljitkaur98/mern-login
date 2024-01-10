
import { useState } from 'react'
import './createaccount.css'

function CreateAccount(){

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async() => {
        const request = await fetch('/api/create-account', {
            method: 'POST',
            body: JSON.stringify({
                name : name,
                email: email,
                password: password
            }),
            headers: {
                'Content-Type' : 'application/json'
            }
            })
        
            const response = await request.json();
            setMessage(response.message);
    }

    return(
        <>
            <div className="main-container">
                <div className="form-container">
                    <h3> Create your account here </h3>
                    <form onSubmit={(event) => event.preventDefault()}>
                        <div className="form-group">
                        <input type="text" 
                            className="form-control mt-4"
                            placeholder="Name" 
                            value={name}
                            onChange={(event) => setName(event.target.value)} />
                        <input type="email" 
                            className="form-control mt-4" 
                            placeholder="Email" 
                            value={email}
                            onChange={(event) => setEmail(event.target.value)} />
                        <input type="password"
                            className="form-control mt-4"
                            value={password}
                            placeholder='Password'
                            onChange={(event) => setPassword(event.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Create Account</button>
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

export default CreateAccount;