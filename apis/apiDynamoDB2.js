const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("./apiDynamoDB");
const { ScanCommand } = require("@aws-sdk/client-dynamodb");

function addMessage(id, message, name){
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

function addThread(id, messageID, message, name){
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
                const thread = chat.chat[messageID - 1].thread
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
    getAllTwitts
    

}