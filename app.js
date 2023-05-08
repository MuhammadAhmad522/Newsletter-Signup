const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
const { options } = require("request");
const { url } = require("inspector");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));


app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

// fetching post request from the html form
app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //data we want to send to api
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]

    };

    const jsonData = JSON.stringify(data);


    const url = "https://us21.api.mailchimp.com/3.0/lists/7180bb4e7a";
    const options = {
        method: "POST",
        auth: "ahmad:6c7d52b1cf4c585c14ffe0897dccabc6-us21"
    }

    // tap into the api server to add data
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {

            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req, res){
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("The server is listening on port 3000");
});

// api key
// 6c7d52b1cf4c585c14ffe0897dccabc6-us21

//list id 7180bb4e7a