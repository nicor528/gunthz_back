const { writeFileSync } = require('fs');
const { default: fetch } = require('node-fetch');

function createSong (input) {
    return(
        new Promise(async (res, rej) => {
            await fetch(`http://18.196.44.248:8000/generate_music/${input}`,{
                method: "GET",
            }).then(async (response) => {
                console.log(response.body)
                const data = await response.blob()
                console.log(data)
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

module.exports = {
    createSong,

}