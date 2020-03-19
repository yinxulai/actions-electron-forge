"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
function log(msg) {
    console.log("\n" + msg);
}
exports.log = log;
function exit(msg) {
    console.error(msg);
    process.exit(1);
}
exports.exit = exit;
;
// Executes the provided shell command and redirects stdout/stderr to the console
function run(cmd, cwd) {
    return child_process_1.execSync(cmd, { encoding: "utf8", stdio: "inherit", cwd: cwd });
}
exports.run = run;
;
function getPlatform() {
    switch (process.platform) {
        case "win32":
            return "windows";
        case "darwin":
            return "mac";
        default:
            return "linux";
    }
}
exports.getPlatform = getPlatform;
function getEnv(name) {
    return process.env[name.toUpperCase()] || null;
}
exports.getEnv = getEnv;
function setEnv(name, value) {
    if (value) {
        process.env[name.toUpperCase()] = value.toString();
    }
}
exports.setEnv = setEnv;
function getInput(name, required) {
    var value = getEnv("INPUT_" + name);
    if (required && !value) {
        exit("\"" + name + "\" input variable is not defined");
    }
    return value;
}
exports.getInput = getInput;
