const { getAllTwitts } = require("./apis/apiDynamoDB");

getAllTwitts().then(twitts=> {
    console.log(twitts)
    console.log(twitts[7])
    console.log(twitts[7].twitts.L[0].M.serverDate)
})