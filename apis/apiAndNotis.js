const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../gunthz-efdba-firebase-adminsdk-ir5fx-83a359e88f.json');

const keyPath = path.join(__dirname, '..', 'gunthz-efdba-firebase-adminsdk-ir5fx-83a359e88f.json');

function sendAndroidNotis(token, type, name, message1){
    const message = {
        data: {
            title: "new " + type + "from " + name,
            subtitle: "new " + type + "from " + name,
            body: "new  " + type + "from " + name + " : " + message1
        },
        tokens: token
    }
    return(
        new Promise((res, rej) => {
            if(token.length > 0){
                admin.messaging().sendEachForMulticast(message)
                .then((response) => {
                  console.log('Notificación enviada con éxito:', response);
                    res()
                })
                .catch((error) => {
                  console.error('Error al enviar la notificación:', error);
                    rej(error)
                });
            }else{
                res()
            }
        })
    )
}

function sendAndroidNotis2(token, alert){
    const message = {
        data: {
            title: alert.title,
            subtitle: alert.subtitle,
            body: alert.body
        },
        tokens: token
    }
    return(
        new Promise((res, rej) => {
            if(token.length > 0){
                admin.messaging().sendEachForMulticast(message)
                .then((response) => {
                  console.log('Notificación enviada con éxito:', response);
                    res()
                })
                .catch((error) => {
                  console.error('Error al enviar la notificación:', error);
                    rej(error)
                });
            }else{
                res()
            }
        })
    )
}

module.exports = {
    sendAndroidNotis,
    sendAndroidNotis2,

}
