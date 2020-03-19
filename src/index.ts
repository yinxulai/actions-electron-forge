import { join } from 'path'
import * as utils from './utils'
import { existsSync, readFileSync } from 'fs'

// 安装依赖并执行
function action() {
  const platform = utils.getPlatform()
  const pkgRoot = utils.getInput('package_root', true)
  const githubToken = utils.getInput('github_token', true)

  const pkgJsonPath = join(pkgRoot || '', "package.json")

  const yarnLockPath = join(pkgRoot || '', 'yarn.lock')
  const npmLockPath = join(pkgRoot || '', 'package-lock.json')

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  if (!pkgJson.scripts) { utils.log(`Package.json no scripts configured`) }

  const scriptName = utils.getInput('script_name', true) || 'publish'
  if (!pkgJson.scripts[scriptName]) { utils.log(`Package.json no ${scriptName} of configured`) }

  // 设置环境变量给后面用
  utils.setEnv('GITHUB_TOKEN', githubToken || '')

  // 通过检查 lock 文件判断使用哪个
  // TODO: 万一他妈两个文件都有 但是实际用的是 yarn 就炸了
  const useNpm = existsSync(npmLockPath)
  if (useNpm) {
    utils.log(`Will run NPM commands in directory '${pkgRoot}'`)
    utils.run('npm install', pkgRoot || '')
    utils.run('npm run publish', pkgRoot || '')
    return utils.log('publish done!')
  }

  const useYarn = existsSync(yarnLockPath)
  if (useYarn) {
    utils.log(`Will run Yarn commands in directory '${pkgRoot}'`)
    utils.run('yarn', pkgRoot || '') // 安装依赖
    utils.run('yarn run publish', pkgRoot || '')
    return utils.log('publish done!')
  }
}

action()
