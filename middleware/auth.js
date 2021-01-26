const jwt = require('jsonwebtoken')
require('dotenv').config({ path: 'variables.env' })


module.exports = function (req, res, next) {

    const token = req.header('x-auth-token')
    // console.log('esteeeeeeeooooo', token)
    // if (!token) {
    //      res.status(401).json({ msg: 'Permiso no valido' })
    //      return next()
    // }

    if (token) {

        try {
            const encoded = jwt.verify(token, process.env.SECRET)

            req.user = encoded

            
        } catch (error) {
            res.status(401).json({ msg: 'Permiso no valido' })
        }
    }
  return  next()
}
