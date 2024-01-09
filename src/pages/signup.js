import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { useState, useEffect } from 'react';

function SignUp() {
  useEffect(() => {
    const urlCode = new URLSearchParams(window.location.search).get("code");
    console.log(urlCode);
    if(urlCode && localStorage.getItem("github_access_token") === null){
      const getAccessToken =  async () => {
        const response = await fetch('/api/github-fetch-token?code=' + urlCode , {
          method: 'GET'
        })
        const data = await response.json()
        console.log(data)
        setLoginData(data);
        localStorage.setItem('loginData', JSON.stringify(data))
      }
      getAccessToken()
    }
  }, [])

  const storedLoginData = localStorage.getItem('loginData');
  const initialLoginData = storedLoginData !== null && storedLoginData !== 'undefined' ? JSON.parse(storedLoginData) : null;
  const [loginData, setLoginData] = useState(initialLoginData);
  
  gapi.load("client:auth2", () => {
    gapi.auth2.init({
      clientId:
        "743083422575-cfs1l8sgjdpderlnhha37atd6aeo6eqq.apps.googleusercontent.com",
      plugin_name: "chat",
    });
  });

  const loginGithub = () => {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID)
  }

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
    let stateObj = { id: "100" };
            window.history.pushState(stateObj,
                "Page 2", "/");
    setLoginData(null);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          {
            loginData ? (
              <div>
                <h3>You logged in as {loginData.name}</h3>
                <button onClick={handleLogout}>Logout</button>
              </div>
            ) : (
              <div>
                <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login With Google"
                onFailure={handleFailure}
                onSuccess={handleSuccess}
                cookiePolicy={'single_host_origin'} >
                </GoogleLogin>
                <button onClick={loginGithub}>Login With Github</button>
              </div>
            )
          }
        </div>
      </header>
    </div>
  );
}

export default SignUp;
