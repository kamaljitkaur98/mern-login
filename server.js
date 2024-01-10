const express = require('express')
const dotenv = require('dotenv')
const { OAuth2Client } = require('google-auth-library')
const path = require('path')
const cors = require('cors')
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

dotenv.config() //access .env on server side

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)


const app = express();

const corsOptions = {
    origin: "http://127.0.0.1:3000",
  };

app.use(express.json());
app.use(cors(corsOptions))

//this is my dummy database for now
const users = [];
users.push({name: '98@gmail.com', email: '98@gmail.com', picture: '98@gmail.com', password: 'abc'})

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

app.post('/api/reset-password', async(req, res) => {
    const email = req.body.email
    const i = users.findIndex((item) => item.email === email)
    if (i === -1) {
        res.status(200);
        res.json({message: "The email ID doesn't exist"});
    }else{
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        const token = jwt.sign(email, jwtSecretKey);
        console.log(token)
        const url = 'http://localhost:3000/api/redirect-reset-password?token=' + token + '&userid=' + email;
        console.log("URL is " + url)

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: '98kamaljitkaur@gmail.com',
              pass: '***' /*replace with your app password */
            }
          });
          
          var mailOptions = {
            from: '98kamaljitkaur@gmail.com',
            to: '98kamaljitkaur@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!' + url
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

        res.status(200)
        res.json({message: "A Link to reset password is send to your mail address"})
    }
})

app.post('/api/redirect-reset-password', async(req,res) => {
    const token = req.query.token
    const userId = req.query.userid
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(verified === userId){
            res.status(200)
            res.json({message: "Please add new password below", verified: true})
        }else{
            res.status(401)
            res.json({message: "The given link is expired or incorrect", verified: false})
        }
    }catch(error){
        res.status(401)
        res.json({message: "The given link is expired or incorrect", verified: false})
    }
})

app.put('/api/update-password', async(req,res) => {
    console.log(req)
    const newpass = req.body.password
    const userid = req.body.userid
    console.log(newpass, userid)
    const i = users.findIndex((item) => item.email === userid)
    console.log(i)
    console.log(users[i].password)
    users[i].password = newpass;
    console.log("New user's array is " + JSON.stringify(users[i]))
    res.status(201)
    res.json({message: "Password updated successfully."})
})

app.post('/api/create-account', async(req,res) => {
  const data = req.body
  const userData = {name: data.name, email: data.email, password: data.password, picture: null}
  const i = users.findIndex((item) => item.email === data.email)
  if(i > -1){
    res.status(200)
    res.json({message: "Account with given mail id already exists"})
  }else{
    users.push(userData)
    res.status(200)
    res.json({message: "Account created suuccessfully"})
  }
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running at http:localhost:${process.env.PORT || 5000}`);
});