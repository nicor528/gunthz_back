
const express = require('express');
const { addTwitt, verifyKey, setNewKey, likeTwitt, commentTwitt, deleteTwitt, followUser, addFollower, unfollowUser, removeFollower, reportTwitt, unLikeTwitt, getUserTwitts, getFollowsTwitts, getAllTwitts, getUser, getFollowings, getFollowers } = require('../apis/apiDynamoDB');
const { saveTwittFile, updateTwittsLinks, updateTwittsLinks2 } = require('../apis/apiS3');
const { trendingTwitts, cleanObject, getAllTwitts2, getComments, verifyToken, orderTwittsForDate } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/postTwitt", async (req, res) => {
    const id = req.body.id;
    const twitt = req.body.twitt;
    const key = req.body.key;
    const fileLink = req.body.fileLink;
    if(id && twitt && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                getUser(id).then(user => {
                    addTwitt(id, twitt, fileLink ? fileLink : false, user.profilePicture, user.name + " " + user.lastName).then(() => {
                        res.status(200).send({status: true, message: "ok", key: newKey})
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
            setNewKey(id, newKey).then(() => {
                likeTwitt(id, ownerID, twittID).then(() => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
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
            setNewKey(id, newKey).then(() => {
                unLikeTwitt(id, ownerID, twittID).then(() => {
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
            setNewKey(id, newKey).then(() => {
                getUser(id).then(user => {
                    commentTwitt(id, ownerID, twittID, comment, user.profilePicture, user.name + " " + user.lastName).then(() => {
                        res.status(200).send({status: true, message: "ok", key: newKey})
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
            setNewKey(id, newKey).then(() => {
                reportTwitt(id, twittID, reason, ownerID).then(() => {
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
            setNewKey(id, newKey).then(() => {
                deleteTwitt(id, twittID).then(() => {
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
    if(token && idOfUser){
        verifyToken(token).then(id => {
            getUserTwitts(idOfUser).then(twitts => {
                updateTwittsLinks(twitts).then(newTwitts => {
                    orderTwittsForDate(newTwitts).then(newTwitts => {
                        res.status(200).send({status: true, message: "ok", data: newTwitts})
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
            setNewKey(id, newKey).then(() => {
                getUser(followID).then(followedUser => {
                    followUser(id, followID, followedUser.profilePicture, followedUser.name + " " + followedUser.lastName).then(() => {
                        getUser(id).then(user => {
                            addFollower(followID, id, user.profilePicture, user.name + " " + user.lastName).then(() => {
                                res.status(200).send({status: true, message: "ok", key: newKey})
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

router.post("/unfollowUser", async (req, res) => {
    const id = req.body.id;
    const unfollowID = req.body.unfollowID;
    const key = req.body.key;
    if(id && key && unfollowID){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(() => {
                unfollowUser(id, unfollowID).then(() => {
                    console.log("1")
                    removeFollower(unfollowID, id).then(() => {
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
                if(follows.length > 1){
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
                if(followers.length > 1){
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
    if(token){
        verifyToken(token).then(id => {
            console.log("test000")
            getFollowsTwitts(id).then(async (twitts) => {
                console.log("test0")
                if(twitts.length > 0){
                    console.log("test1")
                    updateTwittsLinks(twitts).then(newTwitts => {
                        console.log("test2")
                        orderTwittsForDate(newTwitts).then(newTwitts => {
                            res.status(200).send({status: true, message: "ok", data: newTwitts})
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
    if(token){
        verifyToken(token).then(id => {
                getAllTwitts().then(twitts => {
                    trendingTwitts(twitts).then(twitts => {
                        updateTwittsLinks2(twitts).then(twitts => {
                            res.status(200).send({status: true, message: "ok", data: twitts})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

module.exports = router;