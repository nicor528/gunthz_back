const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { PutCommand, DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");


const dynamoDBClient = new DynamoDBClient({
    region: 'eu-central-1', // Reemplaza con tu región deseada
    credentials: fromIni({ profile: "admin-db-gunthz" }),
});

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

function generateAlphanumericCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
}

function createID (uid) {
    return (
        new Promise (async (res, rej) => {
            const newCode = await generateAlphanumericCode();
            const command = await new PutCommand({
                TableName: "gunthz-iox",
                Item: {
                    uid: uid,
                    id: newCode,
                }
            })
            docClient.send(command).then(response => {
                res(newCode)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function verifyKey (id, key) {
    return(
        new Promise (async (res, rej) => {
            const newCode = await generateAlphanumericCode();
            const command = await new GetCommand({
                TableName: "gunthz-keys",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const lastKey = result.Item.key
                if(lastKey == key){
                    res(newCode)
                }else{
                    rej(1)
                }
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getKey (id) {
    return(
        new Promise(async (res, rej) => {
            const command = await new GetCommand({
                TableName: "gunthz-keys",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item.key)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function setNewKey(id, newKey) {
    return(
        new Promise (async (res, rej) => {
            const command = await new PutCommand({
                TableName: "gunthz-keys",
                Item: {
                    id: id,
                    key: newKey
                }
            })
            docClient.send(command).then(result => {
                console.log(result)
                res(result)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getID (uid) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "gunthz-iox",
                Key: {
                    uid: uid
                }
            })
            docClient.send(command).then(result => {
                if(result.Item === undefined){
                    rej(1)
                }else{
                    res(result.Item.id)
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function createUser (id, name, email, pass, lastName, country, city, state, zip) {
    return(
        new Promise (async (res, rej) => {
            const command = await new PutCommand({
                TableName: "gunthz-twitts",
                Item: {
                    id: id,
                    twitts: []
                }
            })
            docClient.send(command).then(response => {
                const command = new PutCommand({
                    TableName: "gunthz-users",
                    Item: {
                        id: id,
                        name: name,
                        email: email,
                        pass: pass,
                        lastName: lastName,
                        followers: [],
                        following: [],
                        admin: false,
                        moderator: false,
                        country: country,
                        city: city,
                        state: state,
                        zip: zip
                    }
                })
                docClient.send(command).then(async (result) => {
                    const token = await generateAlphanumericCode();
                    const command = new PutCommand({
                        TableName: "gunthz-chatTokens",
                        Item: {
                            token: token,
                            id: id
                        }
                    })
                    docClient.send(command).then(result => {
                        res(token)
                    }).catch(error => {console.log(error), rej(error)})
                }).catch(error => {console.log(error), rej(error)})
            }).catch(error => {console.log(error), rej(error)})
        })
    )
}

function getUser (id) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getToken(id){
    return(
        new Promise (async (res, rej) => {
            const command = new ScanCommand({TableName: "gunthz-chatTokens"})
            docClient.send(command).then(result => {
                const tokens = result.Items;
                let token;
                tokens.map(token => {
                    if(token.id.S === id){
                        token = token.token.S;
                    }
                })
                res(token);
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function editInfoUser(id, name, lastName) {
    return (
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                newUser.name = name;
                newUser.lastName = lastName;
                const command = new PutCommand({
                    TableName: "gunthz-users",
                    Item: {
                        id: id,
                        ...newUser
                    }
                })
                docClient.send(command).then(result => {
                    res()
                }).catch(error => {
                    console.log(error)
                    rej(error)
                })
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function addTwitt(id, twitt) {
    return (
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const newID = result.Item.twitts.length + 1;
                const newUser = {
                    twitts : [
                        ...result.Item.twitts,
                        {
                            twitt: twitt,
                            twittID: newID,
                            likes: [],
                            coments : [],
                            ownerID: id,
                        }
                    ]
                }
                const command = new PutCommand({
                    TableName: "gunthz-twitts",
                    Item: {
                        id: id,
                        ...newUser
                    }
                })
                docClient.send(command).then(result => {
                    res()
                }).catch(error => {
                    console.log(error)
                    rej(error)
                })
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function likeTwitt (id, ownerID, twittID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                const twittIndex = newUser.twitts.findIndex((twitt) => twitt.twittID === twittID);
                if(twittIndex !== -1){
                    const newLikeID = id;
                    const twitt = newUser.twitts[twittIndex];
                    if(!twitt.likes.includes(newLikeID)){
                        newUser.twitts[twittIndex].likes.push(newLikeID);
                        const command = new PutCommand({
                            TableName: "gunthz-twitts",
                            Item: {
                                id: ownerID,
                                ...newUser
                            }
                        })
                        docClient.send(command).then(result => {
                            res()
                        }).catch(error => {
                            console.log(error)
                            rej(error)
                        })
                    } else {
                        rej("El twiit ya tiene el like");
                        console.log("El twiit ya tiene el like");
                      }
                }else{
                    rej("twitt not found");
                    console.log('twitt no encontrado');
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function unLikeTwitt (id, ownerID, twittID){
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                let twitts = result.Item.twitts;
                twitts[twittID - 1].likes = twitts[twittID - 1].likes.filter((userID) => userID !== id);
                const command = new PutCommand({
                    TableName: "gunthz-twitts",
                    Item: {
                        id: id,
                        ...twitts
                    }
                })
                docClient.send(command).then(result => {
                    res()
                }).catch(error => {
                    console.log(error)
                    rej(error)
                })
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function commentTwitt (id, ownerID, twittID, comment) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(response => {
                let newUser = response.Item;
                const twittIndex = newUser.twitts.findIndex((twitt) => twitt.twittID === twittID);
                if(twittIndex !== -1){
                    const newComment = {
                        id: id,
                        comment: comment
                    }
                    newUser.twitts[twittIndex].coments.push(newComment);
                    const command = new PutCommand({
                        TableName: "gunthz-twitts",
                        Item: {
                            id: ownerID,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(response => {
                        res();
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                }else{
                    rej("twitt not found");
                    console.log('twitt no encontrado');
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function deleteTwitt (id, twittID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                const twittIndex = newUser.twitts.findIndex((twitt) => twitt.twittID === twittID);
                if (twittIndex !== -1) {
                    newUser.twitts.splice(twittIndex, 1);
                    const updateCommand = new PutCommand({
                        TableName: "gunthz-twitts",
                        Item: {
                            id: id,
                            ...newUser,
                        }
                    })
                    docClient.send(updateCommand).then(() => {
                        res("Twitt eliminado correctamente");
                    }).catch((error) => {
                        console.log(error);
                        rej(error);
                    });
                } else {
                    rej("Twitt no encontrado");
                    console.log("Twitt no encontrado");
                }
            })
        })
    )
}

function followUser(id, followID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                const follows = newUser.following;
                if(!follows.includes(followID)){
                    newUser.following.push(followID);
                    const command = new PutCommand({
                        TableName: "gunthz-users",
                        Item: {
                            id: id,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res();
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                }else{
                    rej("Already following");
                    console.log("Already following");
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function addFollower (id, followerID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                if(!newUser.followers.includes(followerID)){
                    newUser.followers.push(followerID);
                    const command = new PutCommand({
                        TableName: "gunthz-users",
                        Item: {
                            id: id,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res()
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                }else{
                    rej("Already following");
                    console.log("Already following");
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function unfollowUser (id, unfollowID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                const followingIndex = newUser.following.indexOf(unfollowID);
                if(followingIndex !== -1){
                    newUser.following.splice(followingIndex, 1);
                    const command = new PutCommand({
                        TableName: "gunthz-users",
                        Item: {
                            id: id,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res()
                    }).catch((error) => {
                        console.log(error);
                        rej(error);
                    });
                }else{
                    rej("Not following this user");
                    console.log("Not following this user");
                }
            }).catch((error) => {
                console.log(error);
                rej(error);
            });
        })
    )
}

function removeFollower(id, followerID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let newUser = result.Item;
                const followerIdex = newUser.followers.indexOf(followerID);
                if(followerIdex !== -1){
                    newUser.followers.splice(followerIdex, 1);
                    const command = new PutCommand({
                        TableName: "gunthz-users",
                        Item: {
                            id: id,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res()
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                }else{
                    rej("Not following this user");
                    console.log("Not following this user");
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function reportTwitt(userID, twittID, reason, ownerID) {
    return(
        new Promise (async (res, rej) => {
            const command = new PutCommand({
                TableName: "gunthz-reported-twitts",
                Item:{ 
                    reportID: await generateAlphanumericCode(),
                    reason: reason,
                    twittID: twittID,
                    ownerID: ownerID,
                    reporter: userID,
                }
            })
            docClient.send(command).then(result => {
                res()
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getUserTwitts(id){
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item.twitts)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        }).catch(error => {
            console.log(error);
            rej(error)
        })
    )
}

function checkPermisions(id) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const user = result.Item;
                if(user.admin && user.moderator){
                    res()
                }else{
                    rej(1)
                }
            }).catch(error => {
                console.log(error);
                rej(error);
            })
        })
    )
}

/*
function getFollowsTwitts(id){
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const follows = result.Item.following;
                let twitts = [];
                follows.map(id => {
                    const command = new GetCommand({
                        TableName: "gunthz-twitts",
                        Key: {
                            id: id
                        }
                    })
                    docClient.send(command).then(result => {
                        twitts.push(result.Item.twitts)
                    }).catch(error => {
                        console.log(error);
                    })
                })
                res(twitts)
            }).catch(error => {
                console.log(error);
                rej(error);
            })
        })
    )
}*/

function getFollowsTwitts(id) {
    return new Promise(async (res, rej) => {
        try {
            const command = new GetCommand({
                TableName: "gunthz-users",
                Key: {
                    id: id
                }
            });
            const result = await docClient.send(command);
            const follows = result.Item.following;
            // Usamos map para obtener un array de promesas
            const promises = follows.map(async (followId) => {
                const twittCommand = new GetCommand({
                    TableName: "gunthz-twitts",
                    Key: {
                        id: followId
                    }
                });
                const twittResult = await docClient.send(twittCommand);
                return twittResult.Item.twitts;
            });
            // Esperamos a que todas las promesas se resuelvan
            const resolvedTwitts = await Promise.all(promises);
            res(resolvedTwitts);
        } catch (error) {
            console.log(error);
            rej(error);
        }
    });
}

function getAllTwitts(){
    return(
        new Promise(async (res, rej) => {
            const command = await new ScanCommand({TableName: "gunthz-twitts"})
            docClient.send(command).then(result => {
                res(result.Items)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function createLiveSpace(){

}






module.exports = {
    docClient,
    createID,
    verifyKey,
    getKey,
    setNewKey,
    getID,
    createUser,
    generateAlphanumericCode,
    getUser,
    editInfoUser,
    addTwitt,
    likeTwitt,
    commentTwitt,
    deleteTwitt,
    followUser,
    addFollower,
    unfollowUser,
    removeFollower,
    reportTwitt,
    checkPermisions,
    createLiveSpace,
    unLikeTwitt,
    getUserTwitts,
    getFollowsTwitts,
    getAllTwitts,
    getToken

}