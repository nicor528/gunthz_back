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
    return new Promise((res, rej) => {
        try {
            const now = new Date(); // Obtener la fecha y hora actuales

            const filteredTwitts = twittsArray
                .filter(item => item.twitts.L.length > 0 )
            let newTwitts = filteredTwitts.map(item => {
                console.log(item)
                return item.twitts.L
            })

            const flat = newTwitts.flat()

            const lastTwitts = flat.map(item => {
                const serverDate = item.M.serverDate.M;
                console.log(serverDate)

                // Obtener los componentes de la fecha del twitt
                const twittYear = parseInt(serverDate.year.N);
                const twittMonth = parseInt(serverDate.month.N) - 1; // Date considera enero como 0
                const twittDay = parseInt(serverDate.day.N);
                const twittHour = parseInt(serverDate.hour.N);



                // Verificar si el twitt es de hoy o de ayer y si han pasado 24 horas
                if (now.getFullYear() === twittYear &&
                        now.getMonth() === twittMonth &&
                        now.getDate() === twittDay) 
                {
                    return item;
                }
                if(now.getDate() - twittDay === 1 && now.getHours() < twittHour){
                    return item;
                }
                else{
                    return null;
                }
            })
            .filter(Boolean);

            const sortedTwitts = lastTwitts.sort((a, b) => {
                const likesA = a.M.likes.L.length;
                const likesB = b.M.likes.L.length;

                return likesB - likesA;
            })



               /* .map(item => {
                    const serverDate = item.twitts.L[0].M.serverDate.M;

                    // Obtener los componentes de la fecha del twitt
                    const twittYear = parseInt(serverDate.year.N);
                    const twittMonth = parseInt(serverDate.month.N) - 1; // Date considera enero como 0
                    const twittDay = parseInt(serverDate.day.N);
                    const twittHour = parseInt(serverDate.hour.N);

                    // Verificar si el twitt es de hoy o de ayer y si han pasado 24 horas
                    if (
                        (now.getFullYear() === twittYear &&
                            now.getMonth() === twittMonth &&
                            now.getDate() === twittDay &&
                            now.getHours() >= twittHour) ||
                        (now.getDate() - twittDay === 1 && now.getHours() < twittHour)
                    ) {
                        return item;
                    }
                    return null;
                })
                .filter(Boolean); // Eliminar elementos nulos del array

            // Ordenar los twitts por la cantidad de likes, de mayor a menor
            const sortedTwitts = filteredTwitts.sort((a, b) => {
                const likesA = a.twitts.L[0].M.likes.L.length;
                const likesB = b.twitts.L[0].M.likes.L.length;

                return likesB - likesA;
            });*/

            res(sortedTwitts);
        } catch (error) {
            rej(error);
        }
    });
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
            docClient.send(command).then(async (result) => {
                const twitts = result.Item;
                let twitt = [];
                let comments = [];
                console.log(twitts.twitts[twittID - 1])
                twitt.push(twitts.twitts[twittID - 1]);
                if(twitts.twitts[twittID - 1].coments.length > 0){
                    console.log(...twitts.twitts[twittID - 1].coments)
                    comments.push(...twitts.twitts[twittID - 1].coments)
                }
                const data = await {twitt: twitt, comments: comments}
                console.log(data)
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function saveNewLiveSpace (id, title, month, day, hour, minut, year) {
    return(
        new Promise(async (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveSpaces",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                let spaces = result.Item;
                const newSpace = {
                    title: title,
                    month: month,
                    day: day,
                    hour: hour,
                    minut: minut,
                    year: year
                }
                spaces.spaces.push(newSpace);
                const command = new PutCommand({
                    TableName: "gunthz-liveSpaces",
                    Item: {
                        id: id,
                        ...spaces
                    }
                })
                docClient.send(command).then(result => {
                    res()
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

function compararFechas(postA, postB) {
    // Compara los años
    if (postA.serverDate.year !== postB.serverDate.year) {
        return postB.serverDate.year - postA.serverDate.year;
    }

    // Compara los meses si los años son iguales
    if (postA.serverDate.month !== postB.serverDate.month) {
        return postB.serverDate.month - postA.serverDate.month;
    }   
    if (postA.serverDate.day !== postB.serverDate.day) {
        return postB.serverDate.day - postA.serverDate.day;
    }
    if (postA.serverDate.minuts !== postB.serverDate.minuts) {
        return postB.serverDate.minuts - postA.serverDate.minuts;
    }
    if (postA.serverDate.miliSeconds !== postB.serverDate.miliSeconds) {
        return postB.serverDate.miliSeconds - postA.serverDate.miliSeconds;
    }
}

function orderTwittsForDate (twitts) {
    return(
        new Promise( async (res, rej) => {
            try{
                await twitts.sort(compararFechas)
                res(twitts)
            }catch(error){
                console.log(error)
                rej(error)
            }
        })
    )
}

function getUserSpaces(id) {
    return (
        new Promise ( (res, rej) => {
            const command = new GetCommand({
                TableName: "gunthz-liveSpaces",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const spaces = result.Item.spaces;
                res(spaces)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getAllSpaces () {
    return(
        new Promise ((res, rej) => {
            const command = new ScanCommand({ TableName: "gunthz-liveSpaces" });
            docClient.send(command).then(result => {
                res(result.Items)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function compararFechasSpaces(postA, postB) {
    // Compara los añosD
    if (postA.M.year.N !== postB.M.year.N) {
        return postB.M.year.N - postA.M.year.N;
    }

    // Compara los meses si los años son iguales
    if (postA.M.month.N !== postB.M.month.N) {
        return postB.M.month.N - postA.M.month.N;
    }   
    if (postA.M.day.N !== postB.M.day.N) {
        return postB.M.day.N - postA.M.day.N;
    }
    if (postA.M.minut.N !== postB.M.minut.N) {
        return postB.M.minut.N - postA.M.minut.N;
    }
}

function flatSpaces(spaces) {
    return (
        new Promise (async (res, rej) => {
            try{
                const filteredSpaces = spaces.filter(item => item.spaces.L.length > 0)
                console.log(filteredSpaces)
                const justSpaces = filteredSpaces.map(item => {
                    return item.spaces.L
                })
                console.log(justSpaces)
                await justSpaces.sort(compararFechasSpaces)
                res(justSpaces)
            }catch(error){
                console.log(error)
                rej(error)
            }
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
    getComments,
    saveNewLiveSpace,
    orderTwittsForDate,
    getUserSpaces,
    getAllSpaces,
    flatSpaces
    

}