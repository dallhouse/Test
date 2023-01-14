//////////////// L I B R A R I E S ////////////////

const express = require("express");
const app = express();
// THE FOLLOWING LINE IS NEEDED TO APPLY STATIC FILES
app.use(express.static(__dirname + '/'));
const request = require("request");
const https = require("https");
const parser = require("body-parser");
app.use(parser.urlencoded({ extended: true }));

//////////////// A P I ////////////////

app.post("/", function (req, res) {
    const first = req.body.fName;
    const last = req.body.lName;
    const email = req.body.email;
    console.log(first);
    console.log(last);
    console.log(email);

    // must be JSON
    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first,
                    LNAME: last
                }
            }
        ]
    }
    var data = JSON.stringify(data);

    // the '13' in the following link correlates to the server my data lives on
    // can be determined by looking at the list digits of the API key
    const url = "https://us13.api.mailchimp.com/3.0/lists/592c8d7144";
    const options = {
        // syntax here is specific to mailchimp
        method: "POST",
        auth: "abredall:8d60c7556b6a1db8fda0ef3cd02d3dce-us13"
    }

    const mcRequest = https.request(url, options, function(response) {
        response.on("data", function(data) {
            data = JSON.parse(data);
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    })
    
    mcRequest.write(data);
    mcRequest.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

// process.env.PORT is dynamic and is specific to whatever Heroku server this lives on
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running at port 3000");
})

//8d60c7556b6a1db8fda0ef3cd02d3dce-us13

//audienceid: 592c8d7144