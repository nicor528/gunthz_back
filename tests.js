const { getAllTwitts } = require("./apis/apiDynamoDB");
const { getAllTwitts2, trendingTwitts, getComments } = require("./apis/apiDynamoDB2");
const { updateTwittsLinks } = require("./apis/apiS3");

/*getAllTwitts().then(twitts=> {
    trendingTwitts(twitts).then(newTwitts => {
        getAllTwitts2(newTwitts).then(twitts2 => {
            console.log(twitts2)
        }).catch(error => {console.log(error)})
    }).catch(error => {console.log(error)})
})*/

getComments("MUVi01eDUNpHQhBJ", 2).then(twitts => {
    console.log(twitts)
    updateTwittsLinks(twitts).then(twitts => {
        console.log(twitts)
    })
})