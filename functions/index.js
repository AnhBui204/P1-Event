const functions = require('firebase-functions');
const app = require('../app'); // import app.js từ thư mục gốc

exports.api = functions.https.onRequest(app);
