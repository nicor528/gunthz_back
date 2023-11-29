
const express = require('express');
const { addTwitt, verifyKey, setNewKey, likeTwitt, commentTwitt, deleteTwitt, followUser, addFollower, unfollowUser, removeFollower, reportTwitt, unLikeTwitt, getUserTwitts, getFollowsTwitts, getAllTwitts, getUser } = require('../apis/apiDynamoDB');
const { saveTwittFile, updateTwittsLinks, updateTwittsLinks2 } = require('../apis/apiS3');
const { trendingTwitts, cleanObject, getAllTwitts2, getComments } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/postTwitt", async (req, res) => {
    const id = req.body.id;
    const twitt = req.body.twitt;
    const key = req.body.key;
    const fileLink = req.body.fielLink;
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

router.post("/getUserTwitts", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const idOfUser = req.body.idOfUser;
    if(id && key && idOfUser){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(() => {
                getUserTwitts(idOfUser).then(twitts => {
                    updateTwittsLinks(twitts).then(newTwitts => {
                        res.status(200).send({status: true, message: "ok", key: newKey, data: newTwitts})
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
                followUser(id, followID).then(() => {
                    addFollower(followID, id).then(() => {
                        res.status(200).send({status: true, message: "ok", key: newKey})
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

router.post("/getFollowsTwitts", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    if(id && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(() => {
                getFollowsTwitts(id).then(twitts => {
                    updateTwittsLinks(twitts).then(newTwitts => {
                        res.status(200).send({status: true, message: "ok", key: newKey, data: newTwitts})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.post("/getComments", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const ownerID = req.body.ownerID;
    const twittID = req.body.twittID;
    if(id && key && ownerID && twittID){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(() => {
                getComments(ownerID, twittID).then(twitts => {
                    updateTwittsLinks(twitts).then(twitts => {
                        res.status(200).send({status: true, message: "ok", key: newKey, data: twitts})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.post("/tredingTwitts", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    if(id && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(() => {
                getAllTwitts().then(twitts => {
                    trendingTwitts(twitts).then(newTwitts => {
                        //console.log(newTwitts)
                        getAllTwitts2(newTwitts).then(cleanTwitts => {
                            console.log(cleanTwitts)
                            updateTwittsLinks2(newTwitts.twitts).then(twitts => {
                                res.status(200).send({status: true, message: "ok", key: newKey, data: twitts})
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

module.exports = router;