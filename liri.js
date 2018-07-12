require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var command = process.argv[2];

//movie function
var movieThis = function(){
  let title = "Mr. Nobody";
  if(process.argv[3] != null){
    title = process.argv.splice(3).join("+");
  }
  request("http://www.omdbapi.com/?t=" + title + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy", function(error, response, body) {
  if (!error && response.statusCode === 200) {
    console.log("The movie is called: " + JSON.parse(body).Title);
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
    console.log("The movie was released in: " + JSON.parse(body).Year);
    console.log("The movie's tomato rating is: " + JSON.parse(body).tomatoRating);
    console.log("The movie was made in: " + JSON.parse(body).Country);
    console.log("The movie is in: " + JSON.parse(body).Language);
    console.log("The plot is: " + JSON.parse(body).Plot);
    console.log("The cast includes: " + JSON.parse(body).Actors);
  }
  });
}

//spotify function
var spotifyThis = function(songName){
  var spotify = new Spotify(keys.spotify);
  var params = {
      type: "track",
      query: songName
  }
  spotify.search(params, function (err, data) {
      if (err) {
          console.log('Error occurred: ' + err);
          return;
      }
      var songs = data.tracks.items
      for (var i = 0; i < songs.length; i++) {

          console.log("-------")
          console.log("Name: " + songs[i].name)
          console.log("Artist: " + songs[i].artists[0].name)
          console.log("Preview Url: " + songs[i].preview_url)
          console.log("Album Name: " + songs[i].album.name)
      }
  });
}
//twitter function
var myTweets = function(){
  var twitterUserName = "HaleyBelden";
  var params = {screen_name: twitterUserName, count: 20};
  var client = new Twitter(keys.twitter);
  if(process.argv[3] !== null){
    twitterUserName = process.argv[3];
  }
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }
        else {
            for (var i = 0; i < tweets.length; i++) {
                console.log("Tweet: " + tweets[i].text + "\nCreated: " + tweets[i].created_at);
            }
        }
    });
}
//random function
var randomMode = function(){
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
        return console.log(error);
    }
    else {
    console.log(data);
    var randomData = data.split(",");
    spotifyThis(randomData[1]);
    }
  })
};
//command control
if (command == "my-tweets"){
  myTweets();
}
    
else if (command == "spotify-this-song"){
    
  songName = process.argv.splice(3).join("+");
  spotifyThis(songName);
}
else if (command == "movie-this"){
  
  movieThis();
    
}
else if (command == "do-what-it-says"){
  randomMode();
};

