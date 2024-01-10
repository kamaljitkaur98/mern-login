import { useEffect, useState } from 'react';
import './forgotpassword.css';

function ResetPassword(){
    const [password, setPassword] = useState("");
    const [verifyPassword, setVerifyPassword] = useState("");
    const [message, setMessage] = useState("")
    const [validated, setValidated] = useState(true)
    const [passwordCheck, setPasswordCheck] = useState("")

    useEffect(() => {

        const token = new URLSearchParams(window.location.search).get("token");
        const userid = new URLSearchParams(window.location.search).get("userid");
        console.log(token, userid);
        if(token && userid){
        const checkTokenValidate =  async () => {
            const response = await fetch('/api/redirect-reset-password?token=' + token + '&userid=' + userid , {
            method: 'POST'
            })
            const data = await response.json()
            setValidated(data.verified)
            setMessage(data.message)
        }
        checkTokenValidate()
    }

    }, [])


    const handleSubmit = async() => {
        const userid = new URLSearchParams(window.location.search).get("userid");
        if(password === verifyPassword){
            console.log(password)
            const requestUpdatePassword = await fetch('/api/update-password', {
                method: 'PUT',
                body: JSON.stringify({
                    password: password,
                    userid: userid
                }),
                headers: {
                    'Content-Type' : 'application/json'
                  }
            })
            const response = await requestUpdatePassword.json()
            setPasswordCheck(response.message)
        }else{
            setPasswordCheck("The given passwords don't match")
        }
    }

    return(
        <>
            <div className="main-container">
                <div className="form-container">
                    { validated ? (
                        <><h3>{message}</h3><form onSubmit={(event) => event.preventDefault()}>
                            <div className="form-group">
                                <input type="password"
                                    className="form-control mt-4"
                                    id="exampleInputPassword1"
                                    aria-describedby="passwordHelp"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)} />
                                <input type="password"
                                    className="form-control mt-4"
                                    id="exampleInputPassword2"
                                    aria-describedby="passwordHelp"
                                    placeholder="Please verify your password"
                                    value={verifyPassword}
                                    onChange={(event) => setVerifyPassword(event.target.value)} />
                            </div>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Log In</button>
                        </form>
                        {
                            passwordCheck ? (
                                <div>
                                    <p className="alert-text">{passwordCheck}</p>
                                </div>
                            ) : <></>
                        }
                        
                        </>
                        
                    ) : (
                        <>
                            <h3>{message}</h3>
                        </>
                    )}
                    </div>  
                    </div>
        </>
    )
}


export default ResetPassword;
