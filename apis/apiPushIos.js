const apn = require('apn');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const keyPath = path.join(__dirname, '..', 'key.p8');
const options = {
    token: {
        key: keyPath,  // Ruta al archivo de clave privada
        keyId: process.env.keyId,
        teamId: process.env.teamId,
    },
    production: false, // Cambiar a true en producción
};

const apnProvider = new apn.Provider(options) //apn.Provider(options);

const sendNotification = (deviceToken, type, name, message) => {
        const notification = new apn.Notification();
        notification.alert = {
            title: "new " + type + "from " + name,
            subtitle: "new " + type + "from " + name,
            body: "new  " + type + "from " + name + " :" + message
        }
        notification.sound = 'mmhh-yeahh (mp3cut.net).wav';
        notification.badge = 1;
        notification.topic = "com.gunther.gunthz";
        notification.title = "Send Notification";
        return(
            new Promise ((res, rej) => {
                console.log("testXX0")
                if(deviceToken.length > 0){
                    console.log("testxx1")
                    apnProvider.send(notification, deviceToken).then((result) => {
                        console.log(result);
                        res()
                    }).catch(error => {
                        console.log("testXXX3")
                        console.log(error);
                        rej(error.json())
                    });
                }else{
                    console.log("testxx2")
                    res()
                }
            })
        )
};

const sendNotification2 = (deviceToken, alert) => {
    const notification = new apn.Notification();
    notification.alert = {
        title: alert.title,
        subtitle: alert.subtitle,
        body: alert.body
    }
    notification.sound = 'default';
    notification.badge = 1;
    notification.topic = "com.gunther.gunthz";
    notification.title = "Send Notification";
    return(
        new Promise ((res, rej) => {
            if(deviceToken.length > 0){
                apnProvider.send(notification, deviceToken).then((result) => {
                    console.log(result);
                    res()
                }).catch(error => {
                    console.log(error);
                    rej(error)
                });
            }else{
                res()
            }
        })
    )
};

module.exports = {
    sendNotification,
    sendNotification2,

}