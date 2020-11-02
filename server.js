// Dependencies required 
const express = require('express');
const fs = require('fs');
const path = require('path');

// Sets up the express app  
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(express.static(path.join(__dirname, "public")));


let notesInput = [];

// HTML GET Requests 

// HTML route to get notes files 

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// HTML route to return the index file 

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Routes 

// API route to get responses 

app.get("/api/notes", function (req, res) {

    try {

        // Reads db.json file 

        notesInput = fs.readFileSync("./db/db.json", "utf8");

        // Parse notesInput so it is an array of objects
        notesInput = JSON.parse(notesInput)

        // Error handling 
    } catch (err) {
        console.log(err);
    }
    //   Send json object to browser 
    res.json(notesInput);
});


// API route to post responses 

app.post("/api/notes", function (req, res) {

    try {
        // Reads the db.json file 
        notesInput = fs.readFileSync("./db/db.json", "utf8");

        notesInput = JSON.parse(notesInput)

        // Sets the id for the new note 
        req.body.id = notesInput.length;

        // Pushes the new note into the noteData array
        notesInput.push(req.body);

        // Turns it into a string 
        notesInput = JSON.stringify(notesInput);

        // Writes the new note to the db.json file 
        fs.writeFile("./db/db.json", notesInput, "utf8", (err => {

            if (err) throw err;
        }));
        // Changes it back to an object and sends to json object to browser 
        res.json(JSON.parse(notesInput));


    } catch (err) {
        throw err;

    }

});

// API route to delete notes 

app.delete("/api/notes/:id", function (req, res) {

    try {

        notesInput = fs.readFileSync("./db/db.json", "utf8");

        notesInput = JSON.parse(notesInput)


        // Delete existing note from noteData array 
        notesInput = notesInput.filter(function (note) {
            return note.id != req.params.id;
        });

        notesInput = JSON.stringify(notesInput);

        fs.writeFile("./db/db.json", notesInput, "utf8", function (err) {

            if (err) throw err;
        });

        res.send(JSON.parse(notesInput));

    } catch (err) {
        throw err;
    }

});


// Listener 

app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT)
});