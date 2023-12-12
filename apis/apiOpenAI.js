const {OpenAI} = require("openai") ;

const openai = new OpenAI();

function imageGeneration(prompt) {
    return(
        new Promise (async (res, rej) => {
            try{
                const image = await openai.images.generate({ 
                    prompt: prompt,
                    model: "dall-e-2",
                    size: "256x256",
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
                const lyrics = await  client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages = [
                        {
                            role: "user",
                            content: 'Can you write a lyrics for me a ' + description,
                        }
                    ]
                )
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