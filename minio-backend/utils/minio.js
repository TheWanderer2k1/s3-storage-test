const Minio = require('minio');

const minioClient = new Minio.Client({
    endPoint: process.env.ENDPOINT,
    port: parseInt(process.env.PORT),
    useSSL: false,
    accessKey: process.env.ACCESSKEY,
    secretKey: process.env.SECRETKEY,
});

module.exports = minioClient;