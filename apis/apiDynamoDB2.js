const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("./apiDynamoDB");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");

function addMessage(id, message, name, profilePicture){
    let localDate = new Date();
    let localDay = localDate.getDate();
    let localMonth = localDate.getMonth() + 1; 
    let localYear = localDate.getFullYear();
    localDate = localDay + '/' + localMonth + '/' + localYear;
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                let newChat = result.Item;
                console.log(newChat)
                const newID = newChat.chat.length + 1;
                const newMessage = {
                    id: newID,
                    name: name,
                    profilePicture: profilePicture,
                    userID : id,
                    message: message,
                    thread: [],
                    serverDate: localDate,
                    likes: [],
                }
                newChat.chat.push(newMessage);
                const command = new PutCommand({
                    TableName: "gunthz-liveChat",
                    Item: {
                        space: "general",
                        ...newChat
                    }
                })
                docClient.send(command).then(result => {
                    res(newChat)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function addThread(id, messageID, message, name, profilePicture){
    let localDate = new Date();
    let localDay = localDate.getDate();
    let localMonth = localDate.getMonth() + 1; 
    let localYear = localDate.getFullYear();
    localDate = localDay + '/' + localMonth + '/' + localYear;
    return (
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                let newChat = result.Item;
                const newID = newChat.chat[messageID - 1].thread.length + 1
                const newMessage = {
                    id: newID,
                    name: name,
                    profilePicture: profilePicture,
                    userID: id,
                    message: message,
                    serverDate: localDate,
                    likes: []
                }
                newChat.chat[messageID - 1].thread.push(newMessage);
                const command = new PutCommand({
                    TableName: "gunthz-liveChat",
                    Item: {
                        space: "general",
                        ...newChat
                    }
                })
                docClient.send(command).then(result => {
                    res(newChat)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function obtenerUltimosElementos(arr, bloque) {
    // Definir la longitud de cada bloque
    const longitudBloque = 50;
  
    // Calcular el índice de inicio en base al bloque proporcionado
    const indiceInicio = (bloque - 1) * longitudBloque;
  
    // Calcular el índice de fin
    const indiceFin = bloque * longitudBloque;
  
    // Obtener los elementos en el rango especificado
    const elementos = arr.slice(indiceInicio, indiceFin);
  
    return elementos;
}

function getLast50LiveChat(index){
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                const chat = result.Item;
                const sendChat = obtenerUltimosElementos(chat.chat, parseInt(index))
                res(sendChat)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getLiveChat(){
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                const chat = result.Item;
                res(chat.chat)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function likeMessage(userID, messageID){
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                let newChat = result.Item;
                newChat.chat[messageID - 1].likes.push(userID);
                const command = new PutCommand({
                    TableName: "gunthz-liveChat",
                    Item: {
                        space: "general",
                        ...newChat
                    }
                })
                docClient.send(command).then(result => {
                    res(newChat)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function likeThread (id, messageID, threadID){
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                let newChat = result.Item;
                newChat.chat[messageID - 1].thread[threadID - 1].likes.push(id);
                const command = new PutCommand({
                    TableName: "gunthz-liveChat",
                    Item: {
                        space: "general",
                        ...newChat
                    }
                })
                docClient.send(command).then(result => {
                    res(newChat)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function unLikeThread(id, messageID, threadID) {
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                let newChat = result.Item;
                newChat.chat[messageID - 1].thread[threadID - 1].likes = newChat.chat[messageID - 1].thread[threadID - 1].likes.filter((ids) => ids !== id)
                const command = new PutCommand({
                    TableName: "gunthz-liveChat",
                    Item: {
                        space: "general",
                        ...newChat
                    }
                })
                docClient.send(command).then(result => {
                    res(newChat)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function unLikeMessage(userID, messageID) {
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(async (result) => {
                let newChat = result.Item;
                newChat.chat[messageID - 1].likes = await newChat.chat[messageID - 1].likes.filter((ids) => ids !== userID);
                const command = new PutCommand({
                    TableName: "gunthz-liveChat",
                    Item: {
                        space: "general",
                        ...newChat
                    }
                })
                docClient.send(command).then(result => {
                    res(newChat)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function verifyToken(token) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-chatTokens",
                Key: {
                    token: token
                }
            })
            docClient.send(command).then(result => {
                if(result.Item){
                    res(result.Item.id)
                }else{
                    rej("Wrong Token")
                }
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getThread(messageID) {
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveChat",
                Key: {
                    space: "general"
                }
            })
            docClient.send(command).then(result => {
                const chat = result.Item;
                let thread = []
                thread.push(chat.chat[messageID - 1])
                thread.push(...chat.chat[messageID - 1].thread)
                res(thread)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getAllTwitts () {
    return(
        new Promise (async (res, rej) => {
            const command = new ScanCommand({ TableName: "gunthz-twitts" });
            docClient.send(command).then(result => {
                res(result.Items)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function trendingTwitts(twittsArray) {
    return(
        new Promise ((res, rej) => {
            try {
                const now = new Date(); // Obtener la fecha actual
    
                // Filtrar y seleccionar los twitts con serverDate
                const twittsWithDate = twittsArray.filter(item => item.twitts.L.length > 0 && item.twitts.L[0].M.serverDate);
    
                // Filtrar los twitts que ocurrieron en las últimas 24 horas
                const recentTwitts = twittsWithDate.filter(item => {
                    const serverDate = item.twitts.L[0].M.serverDate.M;
                    const twittDate = new Date(`${serverDate.year.N}-${serverDate.month.N}-${serverDate.day.N} ${serverDate.hour.N}:00:00`);
                    const timeDiff = now - twittDate;
                    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
                    return hoursDiff <= 24;
                });
    
                // Ordenar los twitts por la cantidad de likes, de mayor a menor
                const sortedTwitts = recentTwitts.sort((a, b) => {
                    const likesA = a.twitts.L[0].M.likes.L.length;
                    const likesB = b.twitts.L[0].M.likes.L.length;
    
                    return likesB - likesA;
                });
    
                res(sortedTwitts);
            } catch (error) {
                rej(error);
            }
        })
    )
}

// Función para limpiar objetos eliminando los prefijos .M, .A, .S, .N, etc.
function cleanObject(obj) {
    return new Promise((res, rej) => {
        if (Array.isArray(obj)) {
            // Si es un array, limpiar cada elemento del array
            Promise.all(obj.map(cleanObject))
                .then(cleanedArray => res(cleanedArray))
                .catch(error => rej(error));
        } else if (typeof obj === 'object' && obj !== null) {
            const cleanedObject = {};

            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const value = obj[key];

                    // Si el valor es un objeto, llamar recursivamente a cleanObject
                    if (value && typeof value === 'object' && !Array.isArray(value)) {
                        cleanedObject[key] = cleanObject(value);
                    } else {
                        // Eliminar los prefijos .M, .A, .S, .N, etc.
                        const cleanedKey = key.replace(/\.([MASN])\b/g, '');
                        cleanedObject[cleanedKey] = value;
                    }
                }
            }

            res(cleanedObject);
        } else {
            res(obj);
        }
    });
}

// Función para extraer solo los twitts de una estructura de datos
function extractTwitts(obj) {
    return new Promise(async (res, rej) => {
        try {
            const cleanedObj = await cleanObject(obj);
            const twitts = await cleanedObj.twitts;  // Esperar la resolución de la promesa
            res(twitts.L);
        } catch (error) {
            rej(error);
        }
    });
}

// Función para generar un array con todos los twitts
function getAllTwitts2(data) {
    return new Promise(async (res, rej) => {
        const allTwitts = [];

        try {
            // Iterar sobre la estructura de datos y extraer los twitts
            await Promise.all(data.map(async (item) => {
                const twitts = await extractTwitts(item);

                allTwitts.push(...twitts);
            }));

            res(allTwitts);
        } catch (error) {
            rej(error);
        }
    });
}

function getComments(ownerID, twittID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-twitts",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                const twitts = result.Item;
                let data = []
                data.push(twitts.twitts[twittID - 1]);
                if(twitts.twitts[twittID - 1].coments){
                    data.push(...twitts.twitts[twittID - 1].coments)
                }
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}


module.exports = {
    addMessage,
    addThread,
    getLast50LiveChat,
    getLiveChat,
    likeMessage,
    likeThread,
    unLikeThread,
    unLikeMessage,
    verifyToken,
    getThread,
    getAllTwitts,
    trendingTwitts,
    cleanObject,
    getAllTwitts2,
    getComments
    

}