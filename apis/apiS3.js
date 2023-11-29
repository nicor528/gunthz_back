const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { S3Client, ListBucketsCommand, ListObjectsCommand, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3RequestPresigner, getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Hash } = require("@aws-sdk/hash-node");
const { parseUrl } = require("@aws-sdk/url-parser");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { formatUrl } = require("@aws-sdk/util-format-url");

const s3Client = new S3Client({
    region: 'eu-central-1', // Reemplaza con tu región deseada
    credentials: fromIni({ profile: "admin-S3-gunthz" }),
});

const presigner = new S3RequestPresigner({
    region: "eu-central-1", // Reemplaza con la región que corresponda
    credentials: fromIni({ profile: "admin-S3-gunthz" }),
    sha256: Hash.bind(null, "sha256"),
});

async function generarEnlaceDeDescarga(objectKey) {
    return (
        new Promise (async (res, rej) => {
            const url = parseUrl(`https://gunthz-profile-pictures.s3.eu-central-1.amazonaws.com/${objectKey}`);

            // Genera el enlace prefirmado
            presigner.presign(new HttpRequest(url)).then(async (result) => {
                //console.log(result)
                const url = await formatUrl(result)
                res(url)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function uploadProfilePicture (id, image) {
    return(
        new Promise (async (res, rej) => {
            const imageBuffer = Buffer.from(image, "base64");
            const fileName = "profilePicture";
            const key = `${id}/${fileName}`;
            const params = {
                Bucket: "gunthz-profile-pictures",
                Key: key,
                Body: imageBuffer,
                ContentType: "image/jpeg"
            };
            s3Client.send(new PutObjectCommand(params)).then(result => {
                console.log(result);
                console.log(result.Location);
                const path = id + "/" + fileName;
                res(path)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function saveTwittFile (id, gif, name) {
    return(
        new Promise (async (res, rej) => {
            const imageBuffer = Buffer.from(gif, "base64");
            const fileName = name;
            const key = `${id}/twittsFiles/${fileName}`;
            const params = {
                Bucket: "gunthz-profile-pictures",
                Key: key,
                Body: imageBuffer,
                ContentType: "image/gif"
            };
            s3Client.send(new PutObjectCommand(params)).then(result => {
                console.log(result);
                console.log(result.Location);
                const path = key;
                res(path)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

async function updateTwittsLinks (twitts) {
    const newTwitts = await Promise.all(twitts.map(async (twitt) => {
        const path = twitt.profilePicture;
        if(twitt.profilePicture){
            try {
                const result = await generarEnlaceDeDescarga(path);
                twitt.profilePicture = result;
            } catch(error){
                console.log(error)
                throw error;
            }
        }else{
            return twitt;
        }
        return twitt;
    }));
    return newTwitts;
}

async function updateTwittsLinks2 (twitts) {
    console.log(twitts)
    const newTwitts = await twitts.map(async (twitt) => {
        console.log(twitt)
        const path = twitt.M.profilePicture.S;
        if(twitt.M.profilePicture.S){
            try {
                const result = await generarEnlaceDeDescarga(path);
                twitt.M.profilePicture.S = result;
            } catch(error){
                console.log(error)
                throw error;
            }
        }else{
            return twitt;
        }
        return twitt;
    });
    return newTwitts;
}

async function updateLiveChatLinks (chat) {
    const newChats = await Promise.all(chat.map(async (chat) => {
        const path = chat.profilePicture;
        if(chat.profilePicture){
            try {
                const result = await generarEnlaceDeDescarga(path);
                chat.profilePicture = result;
            } catch(error){
                console.log(error)
                throw error;
            }
        }else{
            return chat;
        }
        return chat;
    }));
    return newChats;
}

//s3://gunthz-profile-pictures/MMK0PmorM24Y4xjU/profilePicture
//https://gunthz-profile-pictures.s3.eu-central-1.amazonaws.com/MMK0PmorM24Y4xjU/profilePicture
module.exports = {
    uploadProfilePicture,
    generarEnlaceDeDescarga,
    saveTwittFile,
    updateTwittsLinks,
    updateLiveChatLinks,
    updateTwittsLinks2
    
}