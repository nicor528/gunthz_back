const express = require('express');
const { lyricsGeneration } = require('../apis/apiOpenAI');
const { verifyKey, setNewKey, addTwitt, getUser } = require('../apis/apiDynamoDB');
const router = express.Router();

router.post("/generate-lyrics", (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const prompt = req.body.prompt;
    const title = req.body.title;
    if(id && key && prompt && title){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                getUser(id).then(user => {
                    lyricsGeneration(prompt).then(data => {
                        addTwitt(id, title + " " + data, false, user.profilePicture, user.userName ? user.userName : user.name + " " + user.lastName, "text").then(() => {
                            res.status(200).send({status: true, message: "ok", key: newKey, data: data})
                        }).catch(error => {res.status(400).send({error, status: false})})         
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
        lyricsGeneration
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

module.exports = router;