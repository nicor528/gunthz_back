const express = require('express');
const { verifyKey, setNewKey, checkPermisions, createLiveSpace } = require('../apis/apiDynamoDB');
const router = express.Router();

router.post("/createSpace", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const space_title = req.body.space_title;
    if(id && key && space_title){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                checkPermisions(id).then(() => {
                    createLiveSpace()
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

module.exports = router;