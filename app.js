const express = require('express'); //for app backend
const mysql = require("mysql") //for the database
const dotenv = require('dotenv') //to keep credentials hidden

const bodyParser = require('body-parser'); //so the post request can be sent

const app = express(); //for app backend

dotenv.config({ path: './.env' }) //to hide the database credentials

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
}) //database credentials

db.connect((error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
}) //for connecting to the database

app.set('view engine', 'hbs') //for the view engine

const path = require("path") //require path
const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))
app.get("/", (req, res) => {
    res.render("index")
}) //run on localhost

//to run it on localhost 5000
app.listen();
app.listen(5000, () => {
    console.log("Server started on port 5000")
})

//use npm start on the terminal to run

app.use(express.static(__dirname + '/public'));

//for rendering the pages
app.get("/register", (req, res) => {
    res.render("register")
})
//localhost:5000/index will lead to the index page
app.get("/index", (req, res) => {
    res.render("index")
})
//same for the rest
app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/newmap", (req, res) => {
    res.render("newmap")
})

app.get("/fp", (req, res) => {
    res.render("fp")
})

app.get("/home", (req, res) => {
    res.render("home")
})

app.get("/edit", (req, res) => {
    res.render("edit")
})

app.get("/map", (req, res) => {
    res.render("map")
})

app.get("/premade", (req, res) => {
    res.render("premade")
})

app.get("/test", (req, res) => {
    res.render("test")
})

const bcrypt = require("bcryptjs") //for passwords

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//when the register button is clicked, it will send the data
/*app.post("/auth/register", bodyParser.urlencoded(), (req, res) => {   
    let name = req.body.username;
    let pass = req.body.password;
    let password_confirm = req.body.confirmpassword;
    let email = req.body.email;
    console.log("entered");
    console.log(name);
    var result = db.query('SELECT email FROM users WHERE email = ?', [email], async (error, res) => {
        console.log("selecting");
        if(error){
            console.log(error)
            console.log("error in selecting")
        }
        if(result.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            })
        } else if(pass !== password_confirm) {
            return res.render('register', {
                message: 'Passwords do not match!'
            })
        }
        let hashedPassword = await bcrypt.hash(pass, 8)
        console.log("hash");

        db.query('INSERT INTO users SET?', {username: name, password: hashedPassword, email: email}, (err, res) => {
            if(error) {
                console.log(error)
            } else {
                return res.render('register', {
                    message: 'User registered!'
                })
            }
        })
// registered
    })

}) */

app.post('/auth/register', bodyParser.urlencoded(), (req, res) => {
    //not working somehow? undefined, but it works for the login
    //to get the input fields
    let name = req.body.username;
    let pass = req.body.password;
    let password_confirm = req.body.confirmpassword;
    let email = req.body.email;
    console.log(name); //debugging

    db.query('SELECT email FROM users WHERE email = ?', [email], function (error, results) {
        if (error) {
            console.log(error) //if there is an error with the database or the code
            console.log("error in selecting")
            throw error;
        }
        if (results.length > 0) { //if the email is found in the database
            res.send('Email is already used'); //cannot create because email is already used
            console.log("already used email")
        }
        else if (pass !== password_confirm) { //makes sure that the passwords match
            res.send('Passwords do not match!');
            console.log("already used email");
        }
        let hashedPassword = bcrypt.hash(pass, 8) //to hash the passwords to hide them
        console.log("hash");

        //inserting the inputs into the databases
        db.query('INSERT INTO users SET?', { username: name, password: hashedPassword, email: email }, (err, res) => {
            if (error) {
                console.log(error)
            } else {
                res.send('User registered!');
                console.log("registered");
            }
        })
    })


})

//when the go button in the login page is clicked
app.post('/auth/login', bodyParser.urlencoded(), (req, res) => {
    // get input fields, need to body parse it
    let username = req.body.username;
    let password = req.body.password;

    console.log("login"); //for debugging
    console.log(username); //for debugging

    // make sure the input fields are not empty
    if (username == null || password == null) {
        //empty fields
        res.send('Please enter Username and Password!');
        res.end();
        console.log("empty fields"); //debugging

    } else {
        console.log(username);
        //select the account from the database for on username and password
        db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
            // If there is an error with the query
            console.log("submitted") //for debugging
            if (error) {
                console.log(error) 
                throw error; //throws the error
            }
            // If the account exists
            if (results.length > 0) {
                // authenticate the user
                username.loggedin = true;
                // Redirect to home page
                res.redirect('/home')
                console.log("logged in")
            } else {
                res.send('Incorrect Username and/or Password!'); //sends the message that the username or password is incorrect
                console.log("incorrect") //debugging
            }
            res.end();
        });
    }
});

app.get('/home', function (req, res) {
    // user is logged in
    if (username.loggedin) {
        res.send('Welcome back, ' + req.session.username + '!');
    } else {
        // Not logged in
        res.send('Please login!');
    }
    res.end();
});
//login^
