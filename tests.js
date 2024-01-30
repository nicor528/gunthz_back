const { getAllTwitts, getUser } = require("./apis/apiDynamoDB");
const { getAllTwitts2, trendingTwitts, getComments, getAllScores, divideArray, sortScores, getAllUsersID } = require("./apis/apiDynamoDB2");
const { imageGeneration } = require("./apis/apiOpenAI");
const { sendNotification } = require("./apis/apiPushIos");
const { updateTwittsLinks } = require("./apis/apiS3");
const { createSong } = require("./apis/apiSongs");
const { getRot } = require("./apis/apiSpotify");

/*getAllTwitts().then(twitts=> {
    trendingTwitts(twitts).then(newTwitts => {
        getAllTwitts2(newTwitts).then(twitts2 => {
            console.log(twitts2)
        }).catch(error => {console.log(error)})
    }).catch(error => {console.log(error)})
})*/
/*
getComments("MUVi01eDUNpHQhBJ", 2).then(twitts => {
    console.log(twitts)
    updateTwittsLinks(twitts).then(twitts => {
        console.log(twitts)
    })
})*/
/*
getAllTwitts().then(twitts => {
    console.log(twitts)
    trendingTwitts(twitts).then(twitts => {
        console.log(twitts)
        twitts.map(item => {
            console.log(item.M.likes.L.length)
        })
        //console.log(twitts[0].twitts)
        //console.log(twitts[1].twitts)
    })
})*/
/*
imageGeneration("an futuristic robot").then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})*/
/*getRot("test004@gmail.com").then(rot => {
    console.log(rot);
}).catch(error => {
    console.log(error)
})*/

/*
getAllScores().then(scores => {
    sortScores(scores).then(scores => {
        console.log(scores[15].score.N)
        const newScores = divideArray(scores, 10, 10)
        console.log(newScores.goldScores[0], newScores.goldScores[1], newScores.silverScores[5])
    })
})*/
/*
createSong("a great country song").then(song => {
    console.log(song)
})*/
/*
getUser("1yB9VcVgigNbfVba").then(user => {
    console.log(user)
}).catch(error => {
    console.log(error)
})*/
 /*
getAllUsersID().then(data => {
    console.log(data)
}).catch(error => {
    console.log(error)
})*/

sendNotification(["9032ca69bdd7abf3f3846eeca37c9a50f68fbe3d519c238547bb84c2e701fe0f", "80cf77d6daa97fadeb20f22adac87137a92289986561e2549b54c58ccb593d8ef907d8c2cea1870c0a076e83ecbf9b31676d8e224db4fce239e2393285db9736e677deea10d0c88edf555b383fac941b"], "post").then(() => {
    console.log("ok")
}).catch(error => console.log(error))
