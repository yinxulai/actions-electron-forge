import { join } from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { existsSync, readFileSync } from 'fs'

// 安装依赖并执行
async function action() {
  const release = !!core.getInput('release', { required: false })
  const pkgRoot = core.getInput('package_root', { required: true })
  const githubToken = core.getInput('github_token', { required: release })

  const pkgJsonPath = join(pkgRoot, "package.json")

  const yarnLockPath = join(pkgRoot, 'yarn.lock')
  const npmLockPath = join(pkgRoot, 'package-lock.json')

  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
  if (!pkgJson.scripts) { core.info(`Package.json no scripts configured`) }

  const useNpm = existsSync(npmLockPath)
  if (useNpm) {
    core.info(`Will run NPM commands in directory '${pkgRoot}'`)
    exec.exec('npm', ['install'], { cwd: pkgRoot })
    if (release) {
      await exec.exec('npm', ['run', 'publish'], {
        cwd: pkgRoot,
        env: { 'GITHUB_TOKEN': githubToken }
      })
    }
    return core.info('done!')
  }

  const useYarn = existsSync(yarnLockPath)
  if (useYarn) {
    core.info(`Will run Yarn commands in directory '${pkgRoot}'`)
    exec.exec('yarn', ['install'], { cwd: pkgRoot })
    if (release) {
      await exec.exec('yarn', ['run', 'publish'], {
        cwd: pkgRoot,
        env: { 'GITHUB_TOKEN': githubToken }
      })
    }
    return core.info('publish done!')
  }
}

action()
