"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var utils = __importStar(require("./utils"));
var fs_1 = require("fs");
// 安装依赖并执行
function action() {
    var platform = utils.getPlatform();
    var pkgRoot = utils.getInput('package_root', true);
    var githubToken = utils.getInput('github_token', true);
    var pkgJsonPath = path_1.join(pkgRoot || '', "package.json");
    var yarnLockPath = path_1.join(pkgRoot || '', 'yarn.lock');
    var npmLockPath = path_1.join(pkgRoot || '', 'package-lock.json');
    var pkgJson = JSON.parse(fs_1.readFileSync(pkgJsonPath, "utf8"));
    if (!pkgJson.scripts) {
        utils.log("Package.json no scripts configured");
    }
    var scriptName = utils.getInput('script_name', true) || 'publish';
    if (!pkgJson.scripts[scriptName]) {
        utils.log("Package.json no " + scriptName + " of configured");
    }
    // TODO: 万一他妈两个文件都有 但是实际用的是 yarn 就炸了
    // 通过检查 lock 文件判断使用哪个
    var useNpm = fs_1.existsSync(npmLockPath);
    if (useNpm) {
        utils.log("Will run NPM commands in directory '" + pkgRoot + "'");
        utils.run('npm install', pkgRoot || '');
        utils.run('npm run publish', pkgRoot || '');
        return utils.log('publish done!');
    }
    var useYarn = fs_1.existsSync(yarnLockPath);
    if (useYarn) {
        utils.log("Will run Yarn commands in directory '" + pkgRoot + "'");
        utils.run('yarn', pkgRoot || ''); // 安装依赖
        utils.run('yarn run publish', pkgRoot || '');
        return utils.log('publish done!');
    }
}
action();
