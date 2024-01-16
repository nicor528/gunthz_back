const {OpenAI} = require("openai") ;
const dotenv = require('dotenv');
dotenv.config();

const openai = new OpenAI({
    key: process.env.openIA, // Reemplaza con tu clave secreta de OpenAI
  });

function imageGeneration(prompt) {
    return(
        new Promise (async (res, rej) => {
            try{
                const image = await openai.images.generate({ 
                    prompt: prompt,
                    model: "dall-e-3",
                    size: "1024x1024",
                    quality:"standard",
                    response_format: "b64_json",
                    n:1
                });
                console.log(image.data);
                console.log(image)
                res(image.data[0].b64_json)
            }catch(error){
                console.log(error);
                rej(error)
            }
        })
    )
}

function lyricsGeneration(description) {
    return(
        new Promise(async (res, rej) => {
            try{
                const lyrics = await  openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages : [
                        {
                            role: "user",
                            content: 'Can you write a lyrics for me a ' + description,
                        }
                    ]
                })
                res(lyrics.choices[0].message.content)
            }catch(error){
                console.log(error);
                rej(error)
            }
        })
    )
}

module.exports = {
    imageGeneration,
    lyricsGeneration,
    
}