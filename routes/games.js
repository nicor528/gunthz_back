const express = require('express');
const { verifyKey, setNewKey, getUser } = require('../apis/apiDynamoDB');
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

function x(newScores){
    return(
        new Promise(async (res, rej) => {
    try{            let gold1 = []; let silver1 = []; let bronce1 = [];
                    console.log(newScores.goldScores)
                    console.log(newScores.goldScores[0])
                        await newScores.goldScores.map(user1 => {
                            //console.log(user1)
                            getUser(user1.id.S).then(user => {
                                user1.userName = user.userName;
                                console.log(user1)
                                gold1.push(user1)
                            })
                        })
                    

                        await newScores.silverScores.map(user1 => {
                            getUser(user1.id).then(user => {
                                user1.userName = user.userName;
                                silver1.push(user1)
                            })
                        })
                    
                    
                        await newScores.bronzeScores.map(user1 => {
                            getUser(user1.id).then(user => {
                                user1.userName = user.userName;
                                bronce1.push(user1)
                            })
                        })
                    
                    console.log(gold1)
                    
                    const scores1 = await {goldScores: gold1, silverScores: silver1, bronzeScores: bronce1}
                    res(scores1)
                }catch(error){
                    console.log(error)
                    rej(error)
                }
                })
    )
}

router.get("/top-scores", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getAllScores().then(scores => {
                sortScores(scores).then(async (scores) => {
                    const newScores = divideArray(scores, 10, 10)
                    x(newScores).then(scores => {
                        console.log(scores)
                        res.status(200).send({status: true, message: "ok", data: scores})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        })
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})

module.exports = router;