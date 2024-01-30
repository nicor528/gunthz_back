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

const sendNotification = (deviceToken, type, name) => {
    const notification = new apn.Notification();
    notification.alert = {
        title: "new " + type + "from " + name,
        subtitle: "new " + type + "from " + name,
        body: "new  " + type + "from " + name
    }
    notification.sound = 'default';
    notification.badge = 1;
    notification.topic = "com.gunther.gunthz";
    notification.title = "Send Notification";
    return(
        new Promise ((res, rej) => {
            apnProvider.send(notification, deviceToken).then((result) => {
                console.log(result);
                res()
            }).catch(error => {
                console.log(error);
                rej(error)
            });
        })
    )
};

module.exports = {
    sendNotification,

}