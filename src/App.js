import './App.css';
import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { useState } from 'react';

function App() {

  gapi.load("client:auth2", () => {
    gapi.auth2.init({
      clientId:
        "743083422575-cfs1l8sgjdpderlnhha37atd6aeo6eqq.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

  const [loginData, setLoginData] = useState(localStorage.getItem('loginData') ?
  JSON.parse(localStorage.getItem('loginData')) : null)
  
  const handleFailure = (result) => {
    console.log(result)
  }

  //ajax request to the backend
  const handleSuccess = async (googleData) => {
    const request = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token : googleData.tokenId
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    })

    const response = await request.json();
    setLoginData(response);
    localStorage.setItem('loginData', JSON.stringify(response))
  }

  const handleLogout = () => {
    localStorage.removeItem('loginData')
    setLoginData(null);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {
            loginData ? (
              <div>
                <h3>You logged in as {loginData.email}</h3>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Login With Google"
              onFailure={handleFailure}
              onSuccess={handleSuccess}
              cookiePolicy={'single_host_origin'} >
              </GoogleLogin>
            )
          }
        </div>
      </header>
    </div>
  );
}

export default App;
