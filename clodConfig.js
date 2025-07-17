const cloudinary = require('cloudinary').v2 ; 
const {CloudinaryStorage} = require('multer-storage-cloudinary') ; 

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME , 
    api_key : process.env.CLOUD_API_KEY ,
    api_secret : process.env.CLOUD_API_SECRET
}) ; 


//defining storage..telling where to store nd all
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',
      alloweFormats: ["png" , "jpeg" , "svg" , "jpg"] ,  // supports promises as well
      
    },
  });

module.exports = {cloudinary , storage} ; 