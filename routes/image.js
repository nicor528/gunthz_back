const express = require('express');
const { verifyKey, setNewKey, getUser } = require('../apis/apiDynamoDB');
const { imageGeneration } = require('../apis/apiOpenAI');
const { saveImage, updateImagesLink } = require('../apis/apiS3');
const { savePathImage, verifyToken } = require('../apis/apiDynamoDB2');
const router = express.Router();

router.post("/createImage", (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const prompt = req.body.prompt;
    const title = req.body.title;
    if(id && key && prompt && title){
        verifyKey(id, key).then(newKey => {
            setNewKey(id, newKey).then(data => {
                getUser(id).then(user => {
                    imageGeneration(prompt).then(image => {
                        saveImage(id, image, title).then(path => {
                            addTwitt(id, title, path, user.name + " " + user.lastName, user.profilePicture, "ia").then(() => {
                                res.status(200).send({status: true, message: "ok", key: newKey})
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
/*
router.get("/getUserImages", (req, res) => {
    const token = req.query.token;
    if(token){
        verifyToken(token).then(id => {
            getUserImages(id).then(images => {
                updateImagesLink(images).then(images => { 
                    res.status(200).send({status: true, message: "ok", data: images})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})*/

/*
router.get("/getImage", (req, res) => {
    const token = req.query.token;
    const ownerID = req.query.ownerID;
    const imageID = req.query.image;
    if(token && ownerID && imageID){

    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})*/


module.exports = router;