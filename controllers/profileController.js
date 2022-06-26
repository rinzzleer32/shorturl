const  formidable = require('formidable');
const fs = require('fs-extra')
const path = require('path');
const User = require('../models/User');
const Jimp = require('jimp')


module.exports.formPerfil = async(req,res) =>{

    try {
        const user = await User.findById(req.user.id)


        res.render("perfil",{user:req.user,imagen: user.imagen});
        
    } catch (error) {
        req.flash("mensajes",[{msg:error.message}]);
        res.redirect("/perfil");
    }
    
    

}

module.exports.actualizar = async(req,res) =>{
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50* 1024 * 1024;
    
    form.parse(req,async(error,fields,files)=>{
        try {
            if(error)  {
                throw new Error('fallo algo weon')
            }
            const file = files.myFile;
            if(file.originalFilename === ""){
                throw new Error('por favor agraga una imagen')
            }
            if(!(file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png')){
                throw new Error('por favor agraga una imagen jpg o png');
            }
            if(file.size > 50* 1024 * 1024){
                throw new Error('Maximo 5 mb');
            }
            
            const extension = file.mimetype.split("/")[1];
            
            const dirfile = path.join(__dirname,`../public/profiles/${req.user.id}.${extension}`)
            if (fs.existsSync(dirfile)){fs.unlinkSync(dirfile)}
            fs.copyFile(file.filepath, dirfile,function (err) {
                   if (err) throw err;
                    
               });
            const image = await Jimp.read(dirfile);
            image.resize(200,200).quality(80).writeAsync(dirfile)
            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`;
            await user.save();
            req.flash("mensajes",[{msg:"imagen subida por correcto"}]);
 
        } catch (error) {
            req.flash("mensajes",[{msg:error.message}]);
            
        }
        finally{
            
            return res.redirect('/perfil');
        }
       
    })

}