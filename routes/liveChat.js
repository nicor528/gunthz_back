const express = require('express');
const { setNewKey, verifyKey } = require('../apis/apiDynamoDB');
const { addMessage, addThread, getLast50LiveChat, getLiveChat, likeMessage } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/addMessagge", async (req, res) => {
    const id = req.body.id;
    const message = req.body.message;
    const key = req.body.key;
    if(id && message && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                addMessage(id, message).then(async (messages) => {
                    const data = await {
                        ...messages
                    }
                    res.status(200).send({data, key: newKey, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/get50LiveChat", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const index = req.body.index;
    if(id && key && index){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                get50LiveChat(index).then(chat => {
                    res.status(200).send({data: chat, key: newKey, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/getLiveChat", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    if(id && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                getLiveChat().then(chat => {
                    res.status(200).send({data: chat, key: newKey, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/likeMessage", async (req, res) => {
    const id = req.body.id;
    const messageID = req.body.messageID;
    const key = req.body.key;
    if(id && messageID && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                likeMessage(id, messageID).then(chat => {
                    res.status(200).send({data: chat, key: newKey, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/unLikeMessage", async (req, res) => {
    const id = req.body.id;
    const messageID = req.body.messageID;
    const key = req.body.key;
    if(id && messageID && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                likeMessage(id, messageID).then(chat => {
                    res.status(200).send({data: chat, key: newKey, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/threadMessage", async (req, res) => {
    const id = req.body.id;
    const messageID = req.body.messageID;
    const key = req.body.key;
    const message = req.body.message;
    if(id && message && messageID && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                addThread(id, messageID, message).then(async (messages) => {
                    const data = await {
                        ...messages
                    }
                    res.status(200).send({data ,key: newKey, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/likeThread", async (req, res) => {

})

module.exports = router;