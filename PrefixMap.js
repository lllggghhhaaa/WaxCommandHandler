const { writeFileSync, readFileSync }  = require("fs");
let datapath;

function setPath(path) {
    datapath = path;
}

function setPrefix(guildId, prefix) {
    console.log(datapath)
    writeFileSync(datapath + "\\" + guildId + ".txt", prefix);
}

function getPrefix(guildId) {
    try {
        return readFileSync(datapath + "\\" + guildId + ".txt", "utf-8");
    }
    catch (e){
    }
}

module.exports = {
    setPath,
    setPrefix,
    getPrefix
}