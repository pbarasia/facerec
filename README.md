# facerec
Face recognition using aws rekognition and integrated with whatsapp using Whatsapp chat-api (https://chat-api.com/en/?lang=EN)

Prerequisites - 
  1) Create aws account to get access to aws rekognition api
  2) Create IAM user and get access key and secret key to use in aws-sdk
  3) Install node on your machine
  
  
  After cloning the repo, you will have to create a ***config.js*** in your root project directory. It should have a structure like this:


```javascript
//config.js
module.exports.awsConfig={
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '<your aws access key id>',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '<your aws secret access key>',
  region: process.env.AWS_REGION || '<your aws region>'
}

module.exports.dbConfig={
    host            : '<db host>',
    user            : '<db user>',
    password        : '<db password>',
    database        : '<db name>'
}

module.exports.chatApiConfig={
    apiUrl: '<chat-api instance url>', 
    token: '<chat-api token>'
}
```

For chat-api url and token, create an account here https://chat-api.com/en/?lang=EN . Its free for 3 days so make this step the last one so that you can test and use it. 
This step is required when you want to test and run the whatsapp integration, otherwise you can use the web interface using index.html to play around the face recognition features.

Before running the code, you will also have to create these directories in the root project folder-
**tempImages, uploads, userImages** 
These folders will be used to hold your uploads, tempImages for processing and then userImages which are basically extracted faces from the image.
