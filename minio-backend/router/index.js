const express = require('express');
const router = express.Router();
const controller = require('../controller/')

router.get('/listBuckets', controller.getListBuckets);
router.get('/listObjs', controller.getListObjs);
router.get('/download', controller.downloadFile);
router.post('/upload', controller.uploadFile);
router.post('/delete', controller.deleteFile);

module.exports = router ;