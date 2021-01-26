const express = require('express')
const router = express.Router()
const linkController = require('../controllers/linkController')
// const archiveController = require('../controllers/archiveController')
const { check } = require('express-validator')
const auth = require('../middleware/auth')


router.post('/',
    [
        check('name', 'Sube un archivo').not().isEmpty(),
        check('originalName', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    linkController.createLink
)

router.get('/',

    linkController.getAllLinks,
)

router.get('/:url',
    linkController.checkPassword,
    linkController.getLink,
)

router.post('/:url',
    linkController.validatePassword,
    linkController.getLink,
)

module.exports = router