const express = require('express');
const { verifyToken, getUserUnreadnotifications, getAllUserNotifications, orderTwittsForDate, obtenerObjetosPorPagina } = require('../apis/apiDynamoDB2');
const { sendNotification } = require('../apis/apiPushIos');
const { sendAndroidNotis } = require('../apis/apiAndNotis');
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

router.post("/test-notification", (req, res) => {
    const token_ios = req.body.token_ios;
    const token_and = req.body.token_and;
    if(token_ios){
        sendNotification(token_ios, "test", "test").then(() => {
            res.status(200).send({ status: true, message: "succefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }if(token_and){
        sendAndroidNotis(token_and, "test", "test").then(() => {
            res.status(200).send({ status: true, message: "succefull"})
        }).catch(error => {res.status(400).send({error, status: false})})
    }
})


module.exports = router;