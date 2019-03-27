var Spotify = require("node-spotify-api");
require("dotenv").config();
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var omdB = "http://www.omdbapi.com/?t=";
var apikey = "&y=&plot=short&r=json&apikey=e799df36";
var movie = [];
var axios = require("axios");
var inquirer = require("inquirer");
var band = [];
var music = [];

var startingQuestions = {
  type: "list",
  name: "interaction",
  message: "What do you want to do?",
  choices: [
    "concert-this",
    "spotify-this-song",
    "movie-this",
    "do-what-it-says"
  ]
};

var concertThis = {
  message: "What artist would you like to look up?",
  type: "input",
  name: "artist"
};

var songThat = {
  message: "What song would you like to look up?",
  type: "input",
  name: "song"
};

console.log("Hello! Welcome to Liri-Bot!");
console.log("---------------------------------");
startingPoint();

function startingPoint() {
  inquirer.prompt(startingQuestions).then(answers => {
    if (answers.interaction === "concert-this") {
      getArtist();
    } else if (answers.interaction === "spotify-this-song") {
      getSong();
    } else if (answers.interaction === "movie-this") {
      movieThis();
    } else if (answers.interaction === "do-what-it-says") {
      spotify.search({ type: "track", query: "I want it that way" }, function(
        err,
        data
      ) {
        if (err) {
          return console.log("Error occurred: " + err);
        }

        console.log(data);
        nextSteps();
      });
    }
  });
}

function movieThis() {
  inquirer
    .prompt([
      {
        message: "What movie would you like to look up?",
        type: "input",
        name: "movie"
      }
    ])
    .then(answers => {
      movie.push(answers.movie);
      getAccess(movie);
    });
}

function getAccess(movie) {
  axios.get((omdbApiQuery = omdB + movie + apikey)).then(function(response) {
    console.log(response.data);
    console.log("---------------------------------");
    //need to empty array just incase user wants to continue to use movie-this.
    nextSteps();
  });
}

function getArtist() {
  inquirer.prompt(concertThis).then(answers => {
    console.log(answers.artist);
    console.log("--------------------------------------");
    band.push(answers.artist);
    getBand(band);
  });
}

function getBand(band) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        band +
        "/events?app_id=codingbootcamp&date=upcoming&venue=name&venue=location&venue=date"
    )
    .then(function(response) {
      console.log(response.data);
      console.log("---------------------------------");
      //need to empty array just incase user wants to continue to use movie-this.
      nextSteps();
    });
}

function getSong() {
  inquirer.prompt(songThat).then(answers => {
    console.log(answers.song);
    console.log("--------------------------------------");
    music.push(answers.song);
    getSongInfo(music);
  });
}

function getSongInfo(music) {
  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        music +
        "/events?app_id=codingbootcamp&date=upcoming&venue=name&venue=location&venue=date"
    )
    .then(function(response) {
      console.log(response.data);
      console.log("---------------------------------");
      //need to empty array just incase user wants to continue to use movie-this.
      nextSteps();
    });
}

function nextSteps() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "nextSteps",
        message: "Thank you for your search! What would you like to do next?",
        choices: [
          "concert-this",
          "spotify-this-song",
          "movie-this",
          "do-what-it-says",
          "exit Liri-Bot"
        ]
      }
    ])
    .then(answers => {
      if (answers.nextSteps === "concert-this") {
        inquirer.prompt(concertThis);
      } else if (answers.nextSteps === "spotify-this-song") {
        getArtist();
      } else if (answers.nextSteps === "movie-this") {
        movieThis();
      } else if (answers.nextSteps === "do-what-it-says") {
        spotify.search({ type: "track", query: "I want it that way" }, function(
          err,
          data
        ) {
          if (err) {
            return console.log("Error occurred: " + err);
          }

          console.log(data);
        });
      } else if (answers.nextSteps === "exit Liri-Bot") {
        console.log("---------------------------------");
        console.log("Have a wonderful day!");
        console.log("---------------------------------");
        console.log("Goodbye");
        console.log("---------------------------------");
        console.log("Dont forget to trash this terminal!");
      }
    });
}
