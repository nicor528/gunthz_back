
const express = require('express');
const { verifyKey, setNewKey, editInfoUser, updateProfilePicture } = require('../apis/apiDynamoDB');
const { uploadProfilePicture } = require('../apis/apiS3');
const router = express.Router();

router.post("/editInfoUser", async (req, res) => {
    const key = req.body.key;
    const id = req.body.id;
    const name = req.body.name;
    const lastName = req.body.lastName;
    //const email = req.body.email;
    if(id && name && key){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                editInfoUser(id, name, lastName).then(user => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/updateProfilePicture", async (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const base64Image = req.body.base64Image;
    if(id && key && base64Image){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                uploadProfilePicture(id, base64Image).then(path => {
                    updateProfilePicture(id, path).then(() => {
                        res.status(200).send({status: true, message: "ok", key: newKey})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})


module.exports = router;