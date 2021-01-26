const express = require('express')
const router = express.Router()
const archiveController = require('../controllers/archiveController')
const auth = require('../middleware/auth')



router.post('/',
    auth,
    archiveController.uploadArchive
)

router.get('/:archive',

    archiveController.download,
    archiveController.deleteArchive
)

module.exports = router