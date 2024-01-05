const { fromIni } = require("@aws-sdk/credential-provider-ini");
const { S3Client, ListBucketsCommand, ListObjectsCommand, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { S3RequestPresigner, getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { Hash } = require("@aws-sdk/hash-node");
const { parseUrl } = require("@aws-sdk/url-parser");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { formatUrl } = require("@aws-sdk/util-format-url");
const { default: axios } = require("axios");

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
            const expiracionEnSegundos = 3600 * 6;
            presigner.presign(new HttpRequest(url), { expiresIn: expiracionEnSegundos }).then(async (result) => {
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

function saveImage (id, image, title) {
    return(
        new Promise ((res, rej) => {
            const imageBuffer = Buffer.from(image, "base64");
            const fileName = title;
            const key = `${id}/generated-images/${fileName}`;
            const params = {
                Bucket: "gunthz-profile-pictures",
                Key: key,
                Body: imageBuffer,
                ContentType: "image/jpeg"
            };
            s3Client.send(new PutObjectCommand(params)).then(result => {
                console.log(result);
                //console.log(result.Location);
                //const path = id + "/" + fileName;
                res(key)
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
        /*if(twitt.file){
            const path = twitt.file;
            try {
                const result = await generarEnlaceDeDescarga(path);
                twitt.file = result;
            } catch(error){
                console.log(error)
                throw error;
            }
        }*/
        if(twitt.type === "ia" || twitt.type === "song"){
            try{
                const resultFile = await generarEnlaceDeDescarga(twitt.file);
                twitt.file = resultFile;
            }catch(error){
                console.log(error)
                throw error;
            }
        }
        if(twitt.profilePicture){
            const path = twitt.profilePicture;
            try{
                const result = await generarEnlaceDeDescarga(path);
                twitt.profilePicture = result;
            }catch(error){
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

async function updateImagesLink(images) {
    try {
        const newImages = await Promise.all(
            images.map(async (image) => {
                // Clonar el objeto twitt para no modificar el original
                const newImage = { ...image };

                    try {
                        const result = await generarEnlaceDeDescarga(image.path);
                        // Modificar la propiedad en el nuevo objeto
                        newImage.path = result;
                        const result2 = await generarEnlaceDeDescarga(image.profilePicture);
                        console.log('After generating link');
                        newImage.profilePicture = result2;
                        return newImage;
                    } catch (error) {
                        console.log('Error generating link:', error);
                        throw error;
                    }
            })
        );

        return newImages;
    } catch (error) {
        console.log('Error in updateTwittsLinks2:', error);
        throw error;
    }
}

async function updateTwittsLinks2(twitts) {
    try {
        const newTwitts = await Promise.all(
            twitts.map(async (twitt) => {
                // Clonar el objeto twitt para no modificar el original
                const newTwitt = { ...twitt };

                if (newTwitt.M.profilePicture && newTwitt.M.profilePicture.S && newTwitt.M.type && (newTwitt.M.type.S === "ia" || newTwitt.M.type.S === "song") ) {
                    const path = newTwitt.M.profilePicture.S;
                    console.log('Before generating link');
                    console.log(newTwitt);

                    try {
                        const result = await generarEnlaceDeDescarga(path);
                        // Modificar la propiedad en el nuevo objeto
                        newTwitt.M.profilePicture.S = result;
                        const result2 = await generarEnlaceDeDescarga(newTwitt.M.file.S)
                        newTwitt.M.file.S = result2;
                        return newTwitt;
                    } catch (error) {
                        console.log('Error generating link:', error);
                        throw error;
                    }
                } if(newTwitt.M.profilePicture && newTwitt.M.profilePicture.S){
                    const path = newTwitt.M.profilePicture.S;
                    console.log('Before generating link');
                    console.log(newTwitt);

                    try {
                        const result = await generarEnlaceDeDescarga(path);
                        // Modificar la propiedad en el nuevo objeto
                        newTwitt.M.profilePicture.S = result;
                        return newTwitt;
                    } catch (error) {
                        console.log('Error generating link:', error);
                        throw error;
                    }
                }else {
                    return newTwitt;
                }
            })
        );

        return newTwitts;
    } catch (error) {
        console.log('Error in updateTwittsLinks2:', error);
        throw error;
    }
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

async function saveInS3 (id, nombreArchivo, link) {
    return(
      new Promise (async (res, rej) => {
        descargarArchivoConFetch(link).then(file => {
          console.log(file)
          const params = {
            Bucket: "gunthz-profile-pictures",
            Key: "textSongs/" + id + "/" + nombreArchivo + ".mp3",
            Body: file,
          };
          s3Client.send(new PutObjectCommand(params)).then(result => {
            console.log(result)
            const path = "textSongs/" + id + "/" + nombreArchivo + ".mp3"
            res(path)
          }).catch(error => {
            console.log(error + "test");
            rej(error)
          })
        }).catch(() => {
          rej()
        })
      })
    )
}

async function saveInS3_2 (id, nombreArchivo, link) {
    return(
      new Promise (async (res, rej) => {
        descargarArchivoconAxios(link).then(file => {
          console.log(file)
          const params = {
            Bucket: "gunthz-profile-pictures",
            Key: "textSongs/" + id + "/" + nombreArchivo + ".mp3",
            Body: file,
          };
          s3Client.send(new PutObjectCommand(params)).then(result => {
            console.log(result)
            const path = "textSongs/" + id + "/" + nombreArchivo + ".mp3"
            res(path)
          }).catch(error => {
            console.log(error + "test");
            rej(error)
          })
        }).catch(() => {
          rej()
        })
      })
    )
}

function descargarArchivoconAxios(enlace){
    return new Promise(async (res, rej) => {
        try {
          const response = await axios.get(enlace, { responseType: 'arraybuffer' });
      
          if (!response.data || response.data.length === 0) {
            console.error("El archivo descargado está vacío.");
            rej();
            return;
          }
      
          res(response.data);
        } catch (error) {
          console.error("Error al descargar el archivo:", error);
          rej(error);
        }
      });
}

async function descargarArchivoConFetch(enlace) {
    return(
      new Promise(async (res, rej) => {
        await fetch(enlace).then(async (response) => {
          console.log(response)
          if(!response.ok){
            console.log(response.statusText)
            rej()
          }else{
            const archivoDescargado = await response.buffer();
            res (archivoDescargado);
          }
        })
      })
    )
    try {
      // Realiza la solicitud HTTP GET para descargar el archivo
      const response = await fetch(enlace);
  
      if (!response.ok) {
        throw new Error(`Error al descargar el archivo: ${response.statusText}`);
      }
  
      // Lee el contenido de la respuesta como un Buffer
      const archivoDescargado = await response.buffer();
  
      return archivoDescargado;
    } catch (error) {
      console.error(`Error al descargar el archivo:`, error);
      throw error;
    }
  }

//s3://gunthz-profile-pictures/MMK0PmorM24Y4xjU/profilePicture
//https://gunthz-profile-pictures.s3.eu-central-1.amazonaws.com/MMK0PmorM24Y4xjU/profilePicture
module.exports = {
    uploadProfilePicture,
    generarEnlaceDeDescarga,
    saveTwittFile,
    updateTwittsLinks,
    updateLiveChatLinks,
    updateTwittsLinks2,
    saveImage,
    updateImagesLink,
    saveInS3,
    descargarArchivoconAxios,
    saveInS3_2
    
}