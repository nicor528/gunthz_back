const express = require('express');
const { verifyKey, setNewKey, checkPermisions, createLiveSpace } = require('../apis/apiDynamoDB');
const { createOradorToken, createUserToken } = require('../apis/apiAgora');
const { saveNewLiveSpace, verifyToken, getUserSpaces, getAllSpaces, flatSpaces } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/createSpace", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const title = req.body.title;
    const hour = req.body.hour;
    const minuts = req.body.minuts;
    const day = req.body.day;
    const month = req.body.day;
    const year = req.body.year;
    //const timeLeftToStremInMilliSeconds = parseInt(req.body.timeLeftToStremInMilliSeconds);
    if(id && key && title &&year&& hour && minuts && day && month){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                checkPermisions(id).then(() => {
                    saveNewLiveSpace(id, title, month, day, hour, minuts, year).then(() => { // creates
                        res.status(200).send({status: true, message: "ok", key: newKey})
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

router.get("/getUserSpaces", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getUserSpaces(id).then(spaces => {
                res.status(200).send({status: true, message: "ok", data: spaces})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/getAllSpaces", async (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getAllSpaces().then(spaces => {
                flatSpaces(spaces).then(spaces => {
                    res.status(200).send({status: true, message: "ok", data: spaces})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/createOratorToken", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const title = req.body.title;
    if(id && key && title){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                checkPermisions(id).then(() => {
                    createOradorToken(id, title).then((token) => { // creates
                        res.status(200).send({status: true, message: "ok", key: newKey, token: token})
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
    const title = req.body.title;
    const ownerID = req.body.ownerID;
    if(id && key && title){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                createUserToken(title, id).then(token => {
                    res.status(200).send({status: true, message: "ok", key: newKey, token: token})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{

    }
})



module.exports = router;