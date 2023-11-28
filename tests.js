const { getAllTwitts } = require("./apis/apiDynamoDB");
const { getAllTwitts2, trendingTwitts } = require("./apis/apiDynamoDB2");

getAllTwitts().then(twitts=> {
    trendingTwitts(twitts).then(newTwitts => {
        getAllTwitts2(newTwitts).then(twitts2 => {
            console.log(twitts2)
        }).catch(error => {console.log(error)})
    }).catch(error => {console.log(error)})
})