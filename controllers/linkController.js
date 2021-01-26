const Link = require('../models/Link')
const { validationResult } = require('express-validator')
const shortid = require('shortid')
const bcryptjs = require('bcryptjs')



exports.createLink = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }


    const { originalName, name } = req.body

    const link = new Link()

    link.url = shortid.generate()
    link.name = name
    link.originalName = originalName



    if (req.user) {
        const { password, downloads } = req.body

        if (downloads) {
            link.downloads = downloads
        } 
        if (password) {
            const salt = await bcryptjs.genSalt(10)
            link.password = await bcryptjs.hash(password, salt)
        }
        link.author = req.user.id
    }


    try {
        await link.save()
        return res.json({ msg: `${link.url}` })
        next()
    } catch (error) {
        console.log(error)
        res.status(400).send('Hubo un error')
    }
}


exports.getAllLinks = async (req, res) => {
    try {
        const links = await Link.find({}).select('url -_id')
        res.json({ links })
    } catch (error) {
        console.log(error)
    }
}


exports.checkPassword = async (req, res, next) => {
    const { url } = req.params

    const link = await Link.findOne({ url })
    if (!link) {
        res.status(404).json({ msg: 'enlace no encontrado' })
        return next()
    }

    if (link.password) {
        return res.json({ password: true, link: link.url })
    }
    next()
}


exports.getLink = async (req, res, next) => {
    const { url } = req.params


    const link = await Link.findOne({ url })
    if (!link) {
        res.status(404).json({ msg: 'enlace no encontrado' })
        return next()
    }

    res.json({ archive: link.name, password: false })

    next()
}

exports.validatePassword = async (req, res, next) => {

    const { url } = req.params
    const { password } = req.body

    const link = await Link.findOne({ url })

    if (bcryptjs.compareSync(password, link.password)) {
        next()
    } else {
        return res.status(401).json({ msg: 'Password Incorrecto' })
    }
}
