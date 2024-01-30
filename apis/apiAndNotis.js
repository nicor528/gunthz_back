const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../gunthz-efdba-firebase-adminsdk-ir5fx-83a359e88f.json');

const keyPath = path.join(__dirname, '..', 'gunthz-efdba-firebase-adminsdk-ir5fx-83a359e88f.json');

function sendAndroidNotis(token, type, name){
    const message = {
        data: {
            title: "new " + type + "from " + name,
            subtitle: "new " + type + "from " + name,
            body: "new  " + type + "from " + name
        },
        tokens: token
    }
    return(
        new Promise((res, rej) => {
            admin.messaging().sendEachForMulticast(message)
            .then((response) => {
              console.log('Notificación enviada con éxito:', response);
                res()
            })
            .catch((error) => {
              console.error('Error al enviar la notificación:', error);
                rej(error)
            });
        })
    )
}

module.exports = {
    sendAndroidNotis,

}
