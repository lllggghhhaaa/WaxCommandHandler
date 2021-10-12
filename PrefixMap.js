const { writeFileSync, readFileSync }  = require("fs");

let default_prefix;
let datapath;

function setPath(path) {
    datapath = path;
}

function setDefault(prefix) {
    default_prefix = prefix;
}

function setPrefix(guildId, prefix) {
    console.log(datapath)
    writeFileSync(datapath + "/" + guildId + ".txt", prefix);
}

function getPrefix(guildId) {
    try {
        return readFileSync(datapath + "/" + guildId + ".txt", "utf-8") || default_prefix;
    }
    catch (e) {
        return default_prefix;
    }
}

module.exports = {
    setPath,
    setPrefix,
    getPrefix,
    setDefault
}