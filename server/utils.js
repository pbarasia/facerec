const AWS = require('aws-sdk')
const fs = require('fs');
const sharp=require('sharp');
const https=require('https')
const { v4: uuidv4 } = require('uuid');
const conf=require('../config')

AWS.config.update(conf.awsConfig);

const client = new AWS.Rekognition();

function getByteString(filePath){
    let fileData = fs.readFileSync(filePath);
    return fileData
}

module.exports.getBase64String= function(filePath){
    let fileData = fs.readFileSync(filePath).toString('base64');
    return fileData
}

module.exports.saveImageToDisk = function(url, localPath) {
  var file = fs.createWriteStream(localPath);
  var response = https.get(url , function(response) {
  response.pipe(file);
  });
  }

module.exports.searchFaces = function(sourceImage){
  var params = {
    CollectionId: "MyCollection", 
    FaceMatchThreshold: 95, 
    Image: {
      Bytes: getByteString(sourceImage)
      }, 
    MaxFaces: 5
    };
      return client.searchFacesByImage(params).promise()
}

module.exports.getFaces = async function(sourceImage,doIndex=true){

  debugger;
  let cutFaces=[],faceMatches=[],allFaces=[];

  function sanitizeCoordinates(coordinate){
    if(coordinate<0)
      return 0
    if(coordinate>1)
      return 1
    return coordinate  
  }

  try {
    let faceArray= await (await this.detectFaces(sourceImage)).FaceDetails;
    

    for (let index = 0; index < faceArray.length; index++) {
      const face = faceArray[index].BoundingBox;
      let fileName='./tempImages/test'+index+'.jpg';
      let tmpimg=await sharp(sourceImage).metadata()
      let bb={
          top:parseInt(sanitizeCoordinates(face.Top) * tmpimg.height),
          left:parseInt(sanitizeCoordinates(face.Left) * tmpimg.width) , 
          height:parseInt(sanitizeCoordinates(face.Height) * tmpimg.height) ,
          width:parseInt(sanitizeCoordinates(face.Width) * tmpimg.width),
      }
      allFaces.push({
        top:(sanitizeCoordinates(face.Top)),
        left:(sanitizeCoordinates(face.Left)) , 
        height:(sanitizeCoordinates(face.Height)) ,
        width:(sanitizeCoordinates(face.Width)),

      });
      let img=await sharp(sourceImage).rotate().extract(bb).toFile(fileName)
      let sr=await this.searchFaces(fileName)
      if(sr.FaceMatches.length)
        {
          for (let index = 0; index < sr.FaceMatches.length; index++) {
            const element = sr.FaceMatches[index];
            // console.log(element)
            cutFaces.push(this.getBase64String('./userImages/'+element.Face.ExternalImageId+'.jpg'))
            faceMatches.push(element.Face.ExternalImageId)
          }
        }
      else
        {
          // console.log('not found')
         
          if(doIndex)
            {
              let username='user'+uuidv4();
              this.indexFaces(fileName,username);
              fs.renameSync(fileName,'./userImages/'+username+'.jpg')
            }
        }  
      
    }

} catch (error) {
  console.log('Caught manually - '+error);  
} finally {
  const path = './tempImages/'
  let regex = /[.]jpg$/
  fs.readdirSync(path)
    .filter(f => regex.test(f))
    .map(f => fs.unlinkSync(path + f))
 }

  return {
    cutFaces:cutFaces,
    matches:faceMatches,
    allFaces:allFaces
  };
  
}

module.exports.indexFaces = function(sourceImage,externalName)
{
  const params = {
    Image: {
      Bytes:getByteString(sourceImage)
    },
    CollectionId: "MyCollection",
    ExternalImageId: externalName
  }
  client.indexFaces(params, function(err, response) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      response.FaceRecords.forEach(data => {
        let position   = data.Face.BoundingBox
        // console.log(`Indexed The face at: ${position.Left}, ${position.Top}`)
      }) 
    } 
  });
}

module.exports.detectFaces = function(sourceImage)
{
  const params = {
    Image: {
      Bytes:getByteString(sourceImage)
    },
  }
  return client.detectFaces(params).promise()
}

module.exports.compareFaces = function (sourceImage,targetImage){
  const params = {
    SourceImage: {
      Bytes:getByteString(sourceImage)
    },
    TargetImage: {
      Bytes:getByteString(targetImage)
    },
    SimilarityThreshold: 70
  }
  client.compareFaces(params, function(err, response) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      response.FaceMatches.forEach(data => {
        let position   = data.Face.BoundingBox
        let similarity = data.Similarity
        // console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
      }) // for response.faceDetails
    } // if
  });
}