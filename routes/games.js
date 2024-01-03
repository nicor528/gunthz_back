const express = require('express');
const { verifyKey, setNewKey } = require('../apis/apiDynamoDB');
const { setNewScore, getUserScore } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/new-high-score", (req, res) => {
    const id = req.body.id;
    const score = req.body.score;
    const key = req.body.key;
    if(id && score && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                setNewScore(id, score).then(() => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data in the body", status: false})
    }
})

router.get("/user-score", (req, res) => {
    const id = req.query.id;
    if(id){
        console.log("test0")
        getUserScore(id).then(score => {
            console.log("test")
            res.status(200).send({status: true, message: "ok", data: score})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

module.exports = router;