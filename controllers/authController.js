const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
require('dotenv').config({ path: 'variables.env' })


exports.authenticate = async (req, res, next) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    let user = await User.findOne({ email })

    if (!user) {
        res.status(401).json({ msg: 'El usuario no existe' })
        return next()
    }

    if (bcryptjs.compareSync(password, user.password)){
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
        }, process.env.SECRET, {
            expiresIn: 3600
        })

        res.json({ token })

    } else {

        res.status(401).json({ msg: 'El password es incorrecto' })
         next()
    }
}

exports.authenticatedUser = (req, res) => {

    res.json({ user: req.user })
}