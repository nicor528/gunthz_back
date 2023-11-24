const express = require('express');
const { setNewKey, verifyKey } = require('../apis/apiDynamoDB');
const { addMessage, addThread, getLast50LiveChat, getLiveChat, likeMessage, likeThread, unLikeThread, unLikeMessage, verifyToken, getThread } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/addMessagge", async (req, res) => {
    //const id = req.body.id;
    const message = req.body.message;
    const token = req.body.token;
    if(message && token){
        verifyToken(token).then(id => {
            addMessage(id, message).then(async (messages) => {
                res.status(200).send({data: messages, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/getLast50LiveChat", async (req, res) => {
    const token = req.query.token;
    const index = 1;
    if(token){
        verifyToken(token).then(id => {
            getLast50LiveChat(index).then(chat => {
                res.status(200).send({data: chat, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/getLiveChat", async (req, res) => {
    //const id = req.query.id;
    //const key = req.body.key;
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getLiveChat().then(chat => {
                res.status(200).send({data: chat, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing Token", status: false})
    }
})

router.post("/getThread", async (req, res) => {
    const token = req.body.token;
    const messageID = req.body.messageID;
    if(token && messageID){
        verifyToken(token).then(id => {
            getThread(messageID).then(thread => {
                res.status(200).send({data: thread, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

router.post("/likeMessage", async (req, res) => {
    //const id = req.body.id;
    const messageID = req.body.messageID;
    const token = req.body.token;
    if(token && messageID){
        verifyToken(token).then(id => {
            likeMessage(id, messageID).then(chat => {
                res.status(200).send({data: chat, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/unLikeMessage", async (req, res) => {
    const messageID = req.body.messageID;
    const token = req.body.token;
    if(token && messageID){
        verifyToken(token).then(id => {
            unLikeMessage(id, messageID).then(chat => {
                res.status(200).send({data: chat, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/threadMessage", async (req, res) => {
    //const id = req.body.id;
    const messageID = req.body.messageID;
    const token = req.body.token;
    const message = req.body.message;
    if(token && message && messageID){
        verifyToken(token).then(id => {
            addThread(id, messageID, message).then(async (messages) => {
                res.status(200).send({data: messages, status: true, message: "succefull"})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/likeThread", async (req, res) => {
    //const id = req.body.id;
    const token = req.body.token;
    const messageID = req.body.messageID;
    const threadID = req.body.threadID;
    if(token && messageID && threadID){
        verifyToken(token).then(id => {
            likeThread(id, messageID, threadID).then(messages => {
                res.status(200).send({status: true, message: "ok", data: messages})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/unLikeThread", async (req, res) => {
    //const id = req.body.id;
    const token = req.body.token;
    const messageID = req.body.messageID;
    const threadID = req.body.threadID;
    if(token && messageID && threadID){
        verifyToken(token).then(id => {
            unLikeThread(id, messageID, threadID).then(messages => {
                res.status(200).send({status: true, message: "ok", data: messages})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

module.exports = router;