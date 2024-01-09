const express = require('express')
const dotenv = require('dotenv')
const { OAuth2Client } = require('google-auth-library')
const path = require('path')

dotenv.config() //access .env on server side

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)


const app = express();
app.use(express.json());

//this is my dummy database for now
const users = [];

function insertIntoDB(array, data) {
    const i = array.findIndex((item) => item.email === data.email)
    if (i > -1) array[i] = data;
    else array.push(data);
}

app.post('/api/google-login', async(req,res) => {
    const {token} = req.body;
    const data = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    })

    const { name, email, picture } = data.getPayload();
    insertIntoDB(users, {name, email, picture})
    res.status(201);
    res.json({name, email, picture});
})

app.get('/api/github-fetch-token', async(req,res) => {
    const params = "?client_id=" + process.env.REACT_APP_GITHUB_CLIENT_ID + "&client_secret=" + process.env.REACT_APP_GITHUB_CLIENT_SECRET + "&code=" + req.query.code;
    const data = await fetch('https://github.com/login/oauth/access_token' + params, {
            method: 'POST',
            headers: {
                  'Accept': 'application/json'
            }
      }).then((response) => response.json());
      
      const accessToken = data.access_token;

      // Fetch the user's GitHub profile
      const userProfile = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then((response) => response.json());

      // Handle the user profile data (e.g., store it in your database and log the user in)
      const values = {name: userProfile.name, email: userProfile.email, picture: userProfile.avatar_url}
      insertIntoDB(users, values)
      console.log(values)
      res.status(201);
      res.json(values);
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running at http:localhost:${process.env.PORT || 5000}`);
});