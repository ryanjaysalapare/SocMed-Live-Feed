// Server for generating and periodically sending randomized disaster-related
// mock social media posts categorized by problem type and priority level

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var random = require('random-name');
const LoremIpsum = require("lorem-ipsum").LoremIpsum;

// setup lorem ipsum random text generator
const lorem = new LoremIpsum({});

// When a connection is made, loop forever sending randomly generated social 
// media post content...
io.on('connection', async function(socket){

    console.log("A connection is made...");

    while (true)
    {
      // Randomly generate the post content
      var typePost = Math.floor(Math.random() * 10);
      var postContent = lorem.generateWords(Math.floor(Math.random() * 42) + 3)

      // Randomly generate a fire, flood, power or medical problem
      var typeProblem = Math.floor(Math.random() * 4);
      var problemType = "";
      if (typeProblem == 0) problemType = "Fire";
      else if (typeProblem == 1) problemType = "Flood"
      else if (typeProblem == 2) problemType = "Power"
      else if (typeProblem == 3) problemType = "Medical"

      // Randomly generate the priority level of the problem
      var typePriority = Math.floor(Math.random() * 4);
      var priorityLevel = "";
      if (typePriority == 0) priorityLevel = "Low";
      else if (typePriority == 1) priorityLevel = "Medium"
      else if (typePriority == 2) priorityLevel = "High"
      else if (typePriority == 3) priorityLevel = "Critical"

      // build the social media post content
      post = 
      {
        name: random.first() + " " + random.last(),
        image: "http://localhost:3000/images/" + 
               (Math.floor(Math.random() * 114) + 1) + ".jpg",
        problem: problemType,
        priority: priorityLevel,
        content: postContent
      }

      console.log(post);

      // emit the post
      io.emit('post', post);

      // wait some amount of time until sending the next post
      var nextPostTime = (Math.floor(Math.random() * 10) + 1) * 500;
      await new Promise(r => setTimeout(r, nextPostTime)).catch( error => console.error("error") );
    }

});

app.get("/", function(req,res) {
  res.sendFile(__dirname + "/index.html");
});

// Sends back the image files when they are requested
app.get(/^(.+)$/, function(req,res){
  res.sendFile(__dirname + req.params[0]);
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    