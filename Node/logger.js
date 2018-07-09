var url = "http://mylogger.io/log"

function log(message) {
    //sending http requests
    console.log(message);
}

module.exports.log = log;