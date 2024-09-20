const minioClient = require('../utils/minio');
const { Readable } = require('stream');
const contentDisposition = require('content-disposition');

exports.getListObjs = async (req, res) => {
    let listObjs = [];
    const bucket = req.query.bucket;
    try {
        const stream = minioClient.listObjectsV2(bucket, '', true, '');
        for await (const chunk of stream) {
            listObjs.push(chunk);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'cannot get list objects'
        });
    }
    return res.json({
        data: listObjs
    });
}

exports.getListBuckets = async (req, res) => {
    try {
        const buckets = await minioClient.listBuckets()
        res.json({
            data: buckets
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'cannot get list buckets'
        });
    }
}

exports.uploadFile = async (req, res) => {
    try {
        const bucket = req.body.bucket;
        const file = req.files[0];
        await minioClient.putObject(bucket, file.originalname, file.buffer, file.size, function (err, objInfo) {
            if (err) {
              throw new Error(err);
            }
            console.log(objInfo);
            return res.json({
                data: objInfo
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'upload failed!'
        });
    }
}

exports.downloadFile = async (req, res) => {
    try {
        const fileName = req.query.fileName;
        const bucket = req.query.bucket;
        const stream = await minioClient.getObject(bucket, fileName);
        let size = 0
        let bufArr = []
        for await (const chunk of stream) {
            size += chunk.length
            bufArr.push(chunk);
        }
        let buf = Buffer.concat(bufArr);
        // let file = new File(buf, fileName);
        // res.setHeader('Content-Length', size);
        res.setHeader('Content-Disposition', contentDisposition(fileName));
        res.send(buf);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'download failed!'
        });
    }
}

exports.deleteFile = async (req, res) => {
    try {
        const bucket = req.body.bucket;
        const fileName = req.body.fileName;
        await minioClient.removeObject(bucket, fileName);
        return res.json({
            message: "delete success"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'delete failed!'
        });
    }
}