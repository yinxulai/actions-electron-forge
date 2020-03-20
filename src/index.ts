import { join } from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { existsSync, readFileSync } from 'fs'

// 测试用的
// process.env['INPUT_RELEASE'] = 'TEST'
// process.env['INPUT_GITHUB_TOKEN'] = 'TEST'
// process.env['INPUT_PACKAGE_ROOT'] = '/Users/yinxulai/Desktop/talpa'

// 安装依赖并执行
async function action() {
  const release = !!core.getInput('release', { required: false })
  const pkgRoot = core.getInput('package_root', { required: true })
  const githubToken = core.getInput('github_token', { required: release })

  const yarnLockPath = join(pkgRoot, 'yarn.lock')
  const pkgJsonPath = join(pkgRoot, "package.json")
  const npmLockPath = join(pkgRoot, 'package-lock.json')
  const execOptions = { cwd: pkgRoot, env: { 'GITHUB_TOKEN': githubToken } }

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  if (!pkgJson.scripts) { core.info(`Package.json no scripts configured`) }

  const useNpm = existsSync(npmLockPath)
  if (useNpm) {
    core.info(`Will run NPM commands in directory '${pkgRoot}'`)
    await exec.exec('npm', ['install'], execOptions)
    if (release) {
      await exec.exec('npm', ['run', 'publish'], execOptions)
    }
    return core.info('done!')
  }

  const useYarn = existsSync(yarnLockPath)
  if (useYarn) {
    core.info(`Will run Yarn commands in directory '${pkgRoot}'`)
    await exec.exec('yarn', ['install'], execOptions)
    if (release) {
      await exec.exec('yarn', ['run', 'publish'], execOptions)
    }
    return core.info('done!')
  }
}

action()
