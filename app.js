var express = require("express"),
    app = express(),
    request = require("request"),
    axios = require("axios"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose")
    
mongoose.connect("mongodb://localhost/user_movies");
// mongoose.connect("mongodb://xuanchang:xt2017@ds119081.mlab.com:19081/heroku_5cpxfnz9");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// SCHEMA SETUP
var userMoviesSchema = new mongoose.Schema({
    user_id: String,
    movie_titles: [{type: String}]
});

var UserMovies = mongoose.model("UserMovies", userMoviesSchema);

// UserMovies.create(
//     {
//         user_id: "190",
//         movie_titles: [
//                     "Mostly Martha",
//                     "Monsoon Wedding",
//                     "He Loves Me,  He Loves Me Not",
//                     "Igby Goes Down",
//                     "House of Sand and Fog",
//                     "Elephant",
//                     "The Chorus",
//                     "The Door in the Floor",
//                     "The Weather Underground",
//                     "Happiness"
//                 ]
//     }, function(err, user_Movies){
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATE HUNTINGGROUND: ");
//             console.log(user_Movies);
//         }
//     });

app.get("/", function(req, res) {
   res.render("landing"); 
});


app.get("/user_movies", function(req, res) {
    // res.render("hunting_grounds", {huntingGrounds:huntingGrounds});
    // Get all huntingGrounds from DB
    UserMovies.findOne({user_id: "192"}, function(err, oneUserMovies){
        if(err){
            console.log(err);
        } else {
            // store oneUserMovies.movie_titles into one array, 
            // then loop through this array, and look for the image url from Movie API, store them together into on object
            // then create an array of title_image object
            var movieTitlesArray = oneUserMovies.movie_titles;
            
            var movieTitlesImagesArray = [];
            for (var i = 1; i < movieTitlesArray.length; i++) {
                var encodedTitle = encodeURIComponent(movieTitlesArray[i]);
                var queryUrl = `http://omdbapi.com/?t=${encodedTitle}&apikey=thewdb`;
                var newObject = {
                    title: movieTitlesArray[i],
                    imageUrl: ""
                }
                
                axios.get(queryUrl).then((response) => {
                    newObject.imageUrl = response.data.Poster;
                    console.log(newObject.imageUrl);
                    movieTitlesImagesArray.push(newObject);
                }).catch((e) => {
                    console.log(e);
                });

            }
            setTimeout(() => {
                res.render("user_movies", {toBeDisplaied:movieTitlesImagesArray});
            }, 2000);
            // console.log(JSON.stringify(movieTitlesImagesArray));
        }
    })
});

// app.post("/user_movies", function(req, res) {
//     // get data from form and add to campgrounds array
//     var name = req.body.name;
//     var image = req.body.image;
//     var newHuntingGround = {name: name, image: image};
//     UserMovies.create(newHuntingGround, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect("/user_movies");
//         }
//     })
// });



app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Seashell Hunting server has been started!")
});