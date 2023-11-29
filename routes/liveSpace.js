const express = require('express');
const { verifyKey, setNewKey, checkPermisions, createLiveSpace } = require('../apis/apiDynamoDB');
const router = express.Router();

router.post("/createSpace", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const channel = req.body.channel;
    if(id && key && channel){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                checkPermisions(id).then(() => {
                    createLiveSpace(channel, id).then(token => { // finish
                        saveSpaceToken(id, token, channel).then(data => { // creates
                            res.status(200).send({status: true, message: "ok", key: newKey})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {
                    if(error == 1){
                        res.status(400).send({message: "user not have the permisions", status: false})
                    }else{
                        res.status(400).send({error, status: false})
                    }
                })
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/requestListenerToken", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const channel = req.body.channel;
    const ownerID = req.body.ownerID;
    if(id && key && channel){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{

    }
})



module.exports = router;