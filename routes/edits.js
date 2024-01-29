
const express = require('express');
const { verifyKey, setNewKey, editInfoUser, updateProfilePicture, getUserTwitts, getUser } = require('../apis/apiDynamoDB');
const { uploadProfilePicture, generarEnlaceDeDescarga } = require('../apis/apiS3');
const { updatePosts } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/editInfoUser", async (req, res) => {
    const key = req.body.key;
    const id = req.body.id;
    const name = req.body.name;
    const lastName = req.body.lastName;
    const description = req.body.description;
    const userName = req.body.userName;
    //const email = req.body.email;
    if(id && name && key && description && userName){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                editInfoUser(id, name, lastName, description, userName).then(user => {
                    getUser(id).then(user => {
                        generarEnlaceDeDescarga(user.profilePicture).then(async (url) => {
                            let newUser = user;
                            newUser.profilePicture = url;
                            res.status(200).send({status: true, message: "ok", key: newKey, data: newUser})
                        }).catch(error => {res.status(400).send({error, status:false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
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
                        generarEnlaceDeDescarga(path).then(url => {
                            getUserTwitts(id).then(twitts => {
                                updatePosts(twitts, path, id).then(() => {
                                    res.status(200).send({status: true, message: "ok", key: newKey, data: url})
                                }).catch(error => {res.status(400).send({error, status: false})})
                            }).catch(error => {res.status(400).send({error, status: false})})
                        }).catch(error => {res.status(400).send({error, status: false})})
                    }).catch(error => {res.status(400).send({error, status: false})})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/generateURL", async (req, res) => {
    const path = req.body.path;
    generarEnlaceDeDescarga(path).then(url => {
        console.log(url)
        res.status(200).send({status: true, message: "ok", key: newKey})
    }).catch(error => {res.status(400).send({error, status: false})})
})


module.exports = router;