const express = require('express');
const { verifyKey, setNewKey, getUser, addTwitt } = require('../apis/apiDynamoDB');
const { imageGeneration } = require('../apis/apiOpenAI');
const { saveImage, updateImagesLink, generarEnlaceDeDescarga } = require('../apis/apiS3');
const { savePathImage, verifyToken } = require('../apis/apiDynamoDB2');
const { reducirTamanioImagen } = require('../apis/apiSharp');
const router = express.Router();

router.post("/createImage", (req, res) => {
    const id = req.body.id;
    const key = req.body.key;
    const prompt = req.body.prompt;
    const title = req.body.title;
    if(id && key && prompt && title){
        verifyKey(id, key).then(newKey => {
            getUser(id).then(user => {
                imageGeneration(prompt).then(image => {
                    reducirTamanioImagen(image).then(image => {
                        saveImage(id, image, prompt).then(path => {
                            addTwitt(id, title, path, user.profilePicture, user.userName ? user.userName : user.name + " " + user.lastName, "ia").then(() => {
                                generarEnlaceDeDescarga(path).then(link => {
                                    setNewKey(id, newKey).then(data => {
                                        res.status(200).send({status: true, message: "ok", key: newKey, data: link})
                                    }).catch(error => {res.status(400).send({error, status: false})})
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