const { getAllTwitts } = require("./apis/apiDynamoDB");
const { getAllTwitts2, trendingTwitts, getComments } = require("./apis/apiDynamoDB2");
const { imageGeneration } = require("./apis/apiOpenAI");
const { updateTwittsLinks } = require("./apis/apiS3");
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

imageGeneration("an futuristic robot").then(res => {
    console.log(res)
}).catch(error => {
    console.log(error)
})
/*getRot("test004@gmail.com").then(rot => {
    console.log(rot);
}).catch(error => {
    console.log(error)
})*/