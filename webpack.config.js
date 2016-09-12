var path = require('path');

module.exports = {
    context: __dirname + "/src",
    entry: __dirname + "/src/utils.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "utils.js",
        libraryTarget: "var",
        library: "nmPhoneUtils"
    },
    target: "web",
    externals: [
        {"lodash": "_"}
    ]
};
