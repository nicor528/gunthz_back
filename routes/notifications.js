const express = require('express');
const { verifyToken, getUserUnreadnotifications, getAllUserNotifications, orderTwittsForDate, obtenerObjetosPorPagina, readNotification } = require('../apis/apiDynamoDB2');
const { sendNotification, sendNotification2 } = require('../apis/apiPushIos');
const { sendAndroidNotis, sendAndroidNotis2 } = require('../apis/apiAndNotis');
const { verifyKey, setNewKey } = require('../apis/apiDynamoDB');
const router = express.Router();

router.get("/get-all-user-notifications", (req, res) => {
    const token = req.query.token;
    const index = req.query.index;
    if(token && index){
        verifyToken(token).then(id => {
            getAllUserNotifications(id).then(notifications => {
                orderTwittsForDate(notifications).then(notifications => {
                    const final = obtenerObjetosPorPagina(notifications, index)
                    res.status(200).send({data: final, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.get("/get-all-user-unread-notifications", (req, res) => {
    const token = req.query.token;
    const index = req.query.index;
    if(token && index){
        verifyToken(token).then(id => {
            getUserUnreadnotifications(id).then(notifications => {
                orderTwittsForDate(notifications).then(notifications => {
                    const final = obtenerObjetosPorPagina(notifications, index)
                    res.status(200).send({data: final, status: true, message: "succefull"})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.post("/read-notification", (req, res) => {
    const notificationID = req.body.notificationID;
    const id = req.body.id;
    const key = req.body.key;
    if(notificationID && id){
        verifyKey(id, key).then(newKey => {
            readNotification(id, notificationID).then(() => {
                setNewKey(id, newKey).then(() => {
                    res.status(200).send({status: true, message: "ok", key: newKey})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.post("/test-notification", (req, res) => {
    const token_ios = req.body.token_ios;
    const token_and = req.body.token_and;
    const alert = req.body.alert;
    if(token_ios && alert){
        sendNotification2(token_ios, "test", "test").then(() => {
            res.status(200).send({ status: true, message: "succefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }if(token_and && alert){
        sendAndroidNotis2(token_and, alert).then(() => {
            res.status(200).send({ status: true, message: "succefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(400).send({message: "Missing data", status: false})
    }
})


module.exports = router;