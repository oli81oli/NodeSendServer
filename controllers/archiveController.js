const multer = require('multer')
const shortid = require('shortid')
const fs = require('fs')
const Link = require('../models/Link')

exports.uploadArchive = async (req, res, next) => {

    const configMulter = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads')
            },
            filename: (req, file, cb) => {
                const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
                cb(null, `${shortid.generate()}${ext}`)
            }

        })
    }

    const upload = multer(configMulter).single('archive')

    upload(req, res, async (error) => {


        if (!error) {
            res.json({ archive: req.file.filename })
        } else {
            console.log(error)
            
            return next()
        }
    })
}


exports.download = async (req, res, next) => {

    const link = await Link.findOne({ name: req.params.archive })

    const archive = __dirname + '/../uploads/' + req.params.archive
    res.download(archive)

    const { downloads, name} = link

    if (downloads === 1) {

        req.archive = name

        await Link.findOneAndRemove(link.id)
        next()
    } else {
        link.downloads--
        await link.save()
    }
}



exports.deleteArchive = async (req, res) => {

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.archive}`)
    } catch (error) {
        console.log(error)
    }

}