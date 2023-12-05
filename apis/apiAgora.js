const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const dotenv = require('dotenv');
dotenv.config();

function createOradorToken (id, channel) {
    return(
        new Promise(async (res, rej) => {
            const localDate = new Date();
            try{
                const oratorToken = RtcTokenBuilder.buildTokenWithUid(
                    process.env.agora_app_id,
                    process.env.agora_app_certificate,
                    channel,
                    id,
                    RtcRole.PUBLISHER,
                    6700
                );
                res(oratorToken);
            }catch (error){
                console.log(error);
                rej(error)
            }
        })
    )
}

function createUserToken(channel, id) {
    return(
        new Promise (async (res, rej) => {
            try{
                const listenerToken =  RtcTokenBuilder.buildTokenWithUid(
                    process.env.agora_app_id,
                    process.env.agora_app_certificate,
                    channel,
                    id,
                    RtcRole.SUBSCRIBER,
                    3900
                );
                res(listenerToken)
            }catch(error){
                console.log(error);
                rej(error)
            }
        })
    )
}


module.exports = {
    createOradorToken,
    createUserToken,

}