import GoogleLogin from 'react-google-login';
import { gapi } from "gapi-script";
import { useState, useEffect } from 'react';
import './signup.css';
import logo from './logo.png'
import GoogleLogo from './googlelogo.png'
import GithubLogo from './githublogo.png'

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
    <div className="main">
      <div className="inner_container">
        <div className="left-hand-side">
            <div className="container">
              <div className='col-12'>
                <img className="logo-image mb-2" src={logo} />
                <h3>Log into your account</h3>
                <p className='inner-text'>Welcome back ! Select method to log in:</p>
                <div className='sub-container'>
                  <GoogleLogin clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                  buttonText="Google"
                  onFailure={handleFailure}
                  onSuccess={handleSuccess}
                  render={renderProps => (
                    <div className='google-login'><button onClick={renderProps.onClick} disabled={renderProps.disabled}><img src={GoogleLogo} /> <span>Google</span></button></div>
                  )}
                  cookiePolicy={'single_host_origin'} 
                  >
                  </GoogleLogin>
                  <div className='github-login'><button onClick={loginGithub}><img src={GithubLogo} /> <span>Github</span></button></div>
                </div>
                <div>
                  <form>
                    <div className="horizontal-line">
                      <span>
                        or continue with email below
                      </span>
                    </div>
                    <form>
                      <div className="form-group">
                        <input type="email" className="form-control mt-4" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
                      </div>
                      <div className="form-group">
                        <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                      </div>
                      <div className="form-group form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" for="exampleCheck1">Remember me</label>
                        <a className='forgot-password-anchor'>Forgot Password ?</a>
                      </div>
                      <button type="submit" className="btn btn-primary">Log In</button>
                    </form>
                  </form>
                </div>
                <p className='closing-words mt-4'>Don't have an account? <a className='create-account-anchor'>Create an account</a></p>
              </div>
            </div>
        </div>
        <div className="right-hand-side">
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators mt-5">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img class="d-block w-100" src={logo} alt="First slide" />
            </div>
            <div class="carousel-item">
              <img class="d-block w-100" src={logo} alt="Second slide" />
            </div>
            <div class="carousel-item">
              <img class="d-block w-100" src={logo} alt="Third slide" />
            </div>
          </div>
        </div>
        </div>
      </div>
      
        {/* <div>
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
        </div> */}
      
    </div>
  );
}

export default SignUp;
