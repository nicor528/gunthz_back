const express = require('express');
const { verifyToken, getUserUnreadnotifications, getAllUserNotifications, orderTwittsForDate, obtenerObjetosPorPagina } = require('../apis/apiDynamoDB2');
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


module.exports = router;