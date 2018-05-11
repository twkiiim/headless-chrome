const AWS = require('aws-sdk');

const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

module.exports = {
  uploadFile: (buffer) => {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: 'milinote-web/scrap-thumb',
	Key: 'headless-chrome-screenshot.png',
	Body: buffer,
      };

      return s3.putObject(params, (err) => {
        if(err) { return reject(err); }
	return resolve();
      });
    });
  }
};
