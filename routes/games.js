const express = require('express');
const { verifyKey, setNewKey } = require('../apis/apiDynamoDB');
const { setNewScore, getUserScore, verifyToken, getAllScores, sortScores, divideArray } = require('../apis/apiDynamoDB2');
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
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getUserScore(id).then(score => {
                res.status(200).send({status: true, message: "ok", data: score})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

router.get("/allScores", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getAllScores().then(scores => {
                res.status(200).send({status: true, message: "ok", data: scores})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

router.get("/top-scores", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyKey(token).then(id => {
            getAllScores().then(scores => {
                sortScores(scores).then(scores => {
                    const newScores = divideArray(scores, 10, 10)
                    res.status(200).send({status: true, message: "ok", data: newScores})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        })
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

module.exports = router;