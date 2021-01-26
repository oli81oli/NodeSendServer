const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')

exports.createUser = async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    let user = await User.findOne({ email })
    
    if (user) {
        return res.status(400).json({ msg: 'El usuario ya existe' })
    }
    
    user = new User(req.body)
    const salt = await bcryptjs.genSalt(10)
    
    user.password = await bcryptjs.hash(password, salt)
    
    try {
        await user.save()
        res.json({ msg: 'usuario creado correctamente' })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')

    }

}