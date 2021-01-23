const axios = require('axios');
const utils = require('./utils');
const conf=require('../config').chatApiConfig;

module.exports.sendTextMessage = function(chatId,message){

    const url=`${conf.apiUrl}sendMessage?token=${conf.token}`
    axios.post(url, {
    chatId: chatId,
    body: message
  })
  .then((res) => {
    console.log(`statusCode: ${res.status}`)
    // console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
}


module.exports.sendImage = function(chatId,imagePath){
    const url=`${conf.apiUrl}sendFile?token=${conf.token}`
    axios.post(url, {
    chatId: chatId,
    body: `data:image/jpeg;base64,${utils.getBase64String(imagePath)}`,
    filename: 'test.jpeg'
  })
  .then((res) => {
    console.log(`statusCode: ${res.status}`)
    // console.log(res)
  })
  .catch((error) => {
    console.error(error)
  })
}
