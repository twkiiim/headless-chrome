const { connectChrome } = require('./chrome');
const { uploadFile } = require('./s3');

exports.handler = (event, context, callback) => {
  connectChrome()
    .then(uploadFile)
    .then(context.succeed)
    .catch(context.fail);
};
