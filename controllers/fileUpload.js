// const File = require('../models/File');
// const cloudinary = require('cloudinary').v2;

// async function uploadFileToCloudinary(file, folder) {
//   const options = { folder };
  
//    await cloudinary.uploader.upload(file.tempFilePath, options)
//     }

// function isfiletype(type , supportedType){
//     return supportedType.includes(type)
// }

// exports.fileupload = async (req, res) => {
//   try {
//     const { name, email, tag } = req.body;
//     console.log(req.files); // Add this line to check the structure of req.files
// const file = req.files.imagefile;
// console.log(file);

//     console.log(file);
//     const supportedType = ['jpg', 'jpeg', 'png'];
//     const fileType = file.name.split('.')[1].toLowerCase();

//     if(!isfiletype(fileType , supportedType)){
//       return  res.status(400).json({
//             success: false,
//       message: 'File type is not supported',
//         })
//     }
   
//     const uploadresponse = await uploadFileToCloudinary(file , "Xpenso")
//     console.log(uploadresponse);
//     const filedata = await File.create({
//         name , 
//         email,
//         imageUrl:uploadresponse.secure_url,
//         tag
//     })

//     res.json({
//         success:true,
//         data:filedata,
//         message:"File Uploaded Successfully"
//     })
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: 'Something went wrong during upload',
//     });
//   }
// };
