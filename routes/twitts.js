
const express = require('express');
const { addTwitt, verifyKey, setNewKey, likeTwitt, commentTwitt, deleteTwitt, followUser, addFollower, unfollowUser, removeFollower, reportTwitt, unLikeTwitt, getUserTwitts, getFollowsTwitts, getAllTwitts, getUser, getFollowings, getFollowers, getAllGeneratedImages } = require('../apis/apiDynamoDB');
const { saveTwittFile, updateTwittsLinks, updateTwittsLinks2 } = require('../apis/apiS3');
const { trendingTwitts, cleanObject, getAllTwitts2, getComments, verifyToken, orderTwittsForDate, obtenerObjetosPorPagina, newPostNotification, getTokenIOSArrayNotis, getTokenANDROIDArrayNotis, newLikeNotification, newComentNotification } = require('../apis/apiDynamoDB2');
const { sendNotification } = require('../apis/apiPushIos');
const { sendAndroidNotis } = require('../apis/apiAndNotis');
const router = express.Router();

router.post("/postTwitt", async (req, res) => {
    const id = req.body.id;
    const twitt = req.body.twitt;
    const key = req.body.key;
    const fileLink = req.body.fileLink;
    if(id && twitt && key){
        verifyKey(id, key).then(newKey => {
            getUser(id).then(user => {
                addTwitt(id, twitt, fileLink ? fileLink : false, user.profilePicture, user.userName ? user.userName : user.name + " " + user.lastName, fileLink? "gif" : "text").then(() => {
                    newPostNotification(user.userName ? user.userName : user.name + " " + user.lastName, user.followers).then(() => {
                        getTokenIOSArrayNotis(user.followers).then(tokens => {
                            sendNotification(tokens, "post", user.userName? user.userName : user.name + " " + user.lastName, "").then(() => {
                                getTokenANDROIDArrayNotis(user.followers).then(tokens => {
                                    sendAndroidNotis(tokens, post, user.userName? user.userName : user.name + " " + user.lastName, "").then(() => {
                                        setNewKey(id, newKey).then(data => {
                                            res.status(200).send({status: true, message: "ok", key: newKey})
                                        }).catch(error => {res.status(400).send({error, status: false})})
                                    }).catch(error => {res.status(400).send({error, status: false})})
                                }) .catch(error => {res.status(400).send({error, status: false})})
                            }).catch(error => {res.status(400).send({error, status: false})})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/likeTwitt", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const twittID = req.body.twittID;
    const key = req.body.key;
    if(id && ownerID && twittID && key){
        verifyKey(id, key).then(newKey => {
            getUser(id).then(user1 => {
                likeTwitt(id, ownerID, twittID).then(() => {
                    getUser(ownerID).then(user2 => {
                        newLikeNotification(user1.userName? user1.userName : user1.name + " " + user1.lastName, ownerID).then(() => {
                            if(user2.system === "ios"){
                                sendNotification([user2.token_ios], "like", user1.userName? user1.userName : user1.name + " " + user1.lastName, "").then(() => {
                                    setNewKey(id, newKey).then(() => {
                                        res.status(200).send({status: true, message: "ok", key: newKey})
                                    }).catch(error => {res.status(400).send({error, status: false})})
                                }).catch(error => {res.status(400).send({error, status: false})})
                            }else{
                                sendAndroidNotis([user2.token_and], "like", user1.userName? user1.userName : user1.name + " " + user1.lastName, "").then(() => {
                                    setNewKey(id, newKey).then(() => {
                                        res.status(200).send({status: true, message: "ok", key: newKey})
                                    }).catch(error => {res.status(400).send({error, status: false})})
                                }).catch(error => {res.status(400).send({error, status: false})})
                            }
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/unLikeTwitt", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const twittID = req.body.twittID;
    const key = req.body.key;
    if(id && ownerID && twittID && key){
        verifyKey(id, key).then(newKey => {
            unLikeTwitt(id, ownerID, twittID).then(() => {
                setNewKey(id, newKey).then(() => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/commentTwitt", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const twittID = req.body.twittID;
    const comment = req.body.comment;
    const key = req.body.key;
    if(id && ownerID && twittID && comment && key){
        verifyKey(id, key).then(newKey => {
            getUser(id).then(user1 => {
                commentTwitt(id, ownerID, twittID, comment, user1.profilePicture, user1.userName ? user1.userName : user1.name + " " + user1.lastName).then(() => {
                    getUser(ownerID).then(user2 => {
                        newComentNotification(user1.userName? user1.userName : user1.name + " " + user1.lastName, ownerID).then(() => {
                            if(user2.system === "ios"){
                                sendNotification([user2.token_ios], "comment", user1.userName? user1.userName : user1.name + " " + user1.lastName, "").then(() => {
                                    setNewKey(id, newKey).then(() => {
                                        res.status(200).send({status: true, message: "ok", key: newKey})
                                    }).catch(error => {res.status(400).send({error, status: false})})
                                }).catch(error => {res.status(400).send({error, status: false})})
                            }else{
                                sendAndroidNotis([user2.token_and], "comment", user1.userName? user1.userName : user1.name + " " + user1.lastName, "").then(() => {
                                    setNewKey(id, newKey).then(() => {
                                        res.status(200).send({status: true, message: "ok", key: newKey})
                                    }).catch(error => {res.status(400).send({error, status: false})})
                                }).catch(error => {res.status(400).send({error, status: false})})
                            }
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})


router.post("/reportTwitt", async (req, res) => {
    const id = req.body.id;
    const twittID = req.body.twittID;
    const key = req.body.key;
    const ownerID = req.body.ownerID;
    const reason = req.body.reason;
    if(id && twittID && key && ownerID && reason){
        verifyKey(id, key).then(newKey => {
            reportTwitt(id, twittID, reason, ownerID).then(() => {
                setNewKey(id, newKey).then(() => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/deleteTwitt", async (req, res) => {
    const id = req.body.id;
    const twittID = req.body.twittID;
    const key = req.body.key;
    if(id && twittID && key){
        verifyKey(id, key).then(newKey => {
            deleteTwitt(id, twittID).then(() => {
                setNewKey(id, newKey).then(() => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/getAllTwitts", async (req, res) => {
    getAllTwitts().then(twitts => {
        res.status(200).send({status: true, message: "ok", data: twitts})
    }).catch(error => {res.status(400).send({error, status: false})})
})

router.get("/getUserTwitts", async (req, res) => {
    const token = req.query.token;
    const idOfUser = req.query.idOfUser;
    const index = parseInt(req.query.index);
    if(token && idOfUser && index){
        verifyToken(token).then(id => {
            getUserTwitts(idOfUser).then(twitts => {
                updateTwittsLinks(twitts).then(newTwitts => {
                    orderTwittsForDate(newTwitts).then(async (newTwitts) => {
                        const finalTwitts = obtenerObjetosPorPagina(newTwitts, index)
                        res.status(200).send({status: true, page: index,index: index, message: "ok", data: finalTwitts})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/followUser", async (req, res) => {
    const id = req.body.id;
    const followID = req.body.followID;
    const key = req.body.key;
    if(id && followID && key){
        verifyKey(id, key).then(newKey => {
            getUser(followID).then(followedUser => {
                followUser(id, followID, followedUser.profilePicture, followedUser.name + " " + followedUser.lastName).then(() => {
                    getUser(id).then(user => {
                        addFollower(followID, id, user.profilePicture, user.name + " " + user.lastName).then(() => {
                            setNewKey(id, newKey).then(() => {
                                res.status(200).send({status: true, message: "ok", key: newKey})
                            }).catch(error => {res.status(400).send({error, status: false, message: "Already following"})})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false, message: "Already following"})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.post("/unfollowUser", async (req, res) => {
    const id = req.body.id;
    const unfollowID = req.body.unfollowID;
    const key = req.body.key;
    if(id && key && unfollowID){
        verifyKey(id, key).then(newKey => {
            unfollowUser(id, unfollowID).then(() => {
                console.log("1")
                removeFollower(unfollowID, id).then(() => {
                    setNewKey(id, newKey).then(() => {
                        console.log("2")
                        res.status(200).send({status: true, message: "ok", key: newKey})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.get("/getFollowings", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getFollowings(id).then(follows => {
                if(follows.length > 0){
                    updateTwittsLinks(follows).then(data => {
                        res.status(200).send({status: true, message: "ok", data: data})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }else{
                    console.log("asd")
                    res.status(200).send({status: true, message: "ok", data: []})
                }
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.get("/getFollowers", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getFollowers(id).then(followers => {
                if(followers.length > 0){
                    updateTwittsLinks(followers).then(data => {
                        res.status(200).send({status: true, message: "ok", data: data})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }else{
                    console.log("asd")
                    res.status(200).send({status: true, message: "ok", data: []})
                }
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.get("/getFollowsTwitts", async (req, res) => {
    //const id = req.body.id;
    //const key = req.body.key;
    const token = req.query.token;
    const index = parseInt(req.query.index);
    if(token && index){
        console.log(token)
        verifyToken(token).then(id => {
            console.log("test000")
            getFollowsTwitts(id).then(async (twitts) => {
                console.log("test0")
                if(twitts.length > 0){
                    console.log("test1")
                    updateTwittsLinks(twitts).then(newTwitts => {
                        console.log("test2")
                        orderTwittsForDate(newTwitts).then(newTwitts => {
                            const finalTwitts = obtenerObjetosPorPagina(newTwitts, index)
                            res.status(200).send({status: true, page: index, index: index,  message: "ok", data: finalTwitts})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }
                else{
                    console.log("asd")
                    res.status(200).send({status: true, message: "ok", data: []})
                }
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false}) 
    }
})

router.get("/getComments", async (req, res) => {
    const token = req.query.token;
    const ownerID = req.query.ownerID;
    const twittID = parseInt(req.query.twittID);
    if(token && ownerID && twittID){
        verifyToken(token).then(id => {
            getComments(ownerID, twittID).then(twitts1 => {
                updateTwittsLinks(twitts1.twitt).then(twitts => {
                    updateTwittsLinks(twitts1.comments).then(async (commentTwitt) => {
                        const data = await {
                            twitt : twitts,
                            comments : commentTwitt
                        }
                        res.status(200).send({status: true, message: "ok", data: data})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.get("/tredingTwitts", async (req, res) => {
    const token = req.query.token
    const index = parseInt(req.query.index);
    if(token && index){
        verifyToken(token).then(id => {
                getAllTwitts().then(twitts => {
                    trendingTwitts(twitts).then(async (twitts) => {
                        const indexTwitts = await obtenerObjetosPorPagina(twitts, index)
                        updateTwittsLinks2(indexTwitts).then(twitts => {
                            res.status(200).send({status: true, page: index,index: index, message: "ok", data: twitts})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

/*
router.get("/trending-post", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyKey(token).then(id => {
            getAllTwitts().then(twitts => {
                getAllGeneratedImages().then(images => {

                })
            })
        })
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})*/

module.exports = router;