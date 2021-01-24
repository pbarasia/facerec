const utils = require('./utils');
const db = require('./db');
const chatApi=require('./chatApi');
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser= require('body-parser');
const multer  = require('multer');
const https=require('https')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.static('dist'))
app.use("/img", express.static(__dirname + "/uploads"));
app.use(bodyParser.json())

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage })

router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
    res.send(file)
  
})

router.get('/showFaces',function(req,res){
  let target='./uploads/'+req.query.targetImage
  utils.getFaces(target).then(function(data){
      var response={
          target:utils.getBase64String(target),
          faces: data.cutFaces,
          matches:data.matches,
          allFaces:data.allFaces
      }
      res.json(response)
  })
  
});

function processImage(url,callback,doIndex=true){

  const filename='./uploads/'+uuidv4()+'.jpeg';

  var file = fs.createWriteStream(filename);

  https.get(url , async function(response) {

    var stream=response.pipe(file);
    await new Promise(fulfill => stream.on("finish", fulfill));

    utils.getFaces(filename,doIndex).then(function(data){
      if(doIndex){
        for(let index in data.allFaces)
        {
          db.addMap(data.allFaces[index],filename)
        }
      }
      var response={
          faces: data.cutFaces,
          matches:data.matches,
          allFaces:data.allFaces
      }
      if(!doIndex){
        fs.unlink(filename, (err) => {
          if (err) {
            console.error(err)
            return
          }
          //file removed
        })
      }
      callback(response)
    }) 
 });

}

router.post('/webhook1', function(req,res){
  const data = req.body;
  console.log('recieved message')
  for (var i in data.messages) {
      let message=data.messages[i];
      if(message.fromMe) return;
      if(message.type==='image' &&  message.caption && message.caption.toLowerCase().indexOf('my photos')>=0)
      {
        const url = message.body;
        processImage(url,function(response){
          if(response.faces.length!==1)
          {
            return chatApi.sendTextMessage(message.chatId ,'Invalid image');
          }
          else{
            for(var j in response.matches)
            {
              // console.log('matches user '+response.matches[j])
              db.getImagesForUser(response.matches[j],function(imageList){
                if(imageList.length==0)
                  console.log('no db entry found')
                for(var k in imageList)
                {
                  chatApi.sendImage(message.chatId ,imageList[k].image)
                }
              })
            }
          }
        },false)
      } 
      else if (message.chatName=='Facerec test')
      {
          if(message.type==='image')
          {
            const url = message.body;
            processImage(url,function(response){
              res.json(response)
            })
            
          }
      }  
     
  }
  
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');