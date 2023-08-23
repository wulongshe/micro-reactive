const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const Mustache = require('mustache')
const axios = require('axios')
const compressing = require('compressing')
const { getPath, ensueLatest, refresh } = require('micro-reactive-template')
const Command = require('./Command')

const tmpdir = os.tmpdir()
const registryUrl = 'https://registry.npmjs.org'

/**
 * @typedef {Object} Options
 * @property {string} name
 * @property {string} frame
 * @property {string} store
 */

/**
 * @param {Options} options
 */
module.exports = async function create(options) {
  const ensueLatestRequest = ensueLatest()
  const { name, frame } = options
  const targetPath = path.resolve(process.cwd(), name)

  if (await fs.exists(targetPath)) {
    if (!(await Command.exists())) return
    await fs.remove(targetPath)
  }

  if (!(await ensueLatestRequest)) {
    await refresh()
  }

  const spinner = ora()
  spinner.start('Project initialization...')
  await compressing.tgz.uncompress(getPath('frame', frame), tmpdir)
  await fs.copy(path.join(tmpdir, frame), targetPath)
  await replacePackageJson(path.resolve(targetPath, 'package.json'), name)
  await copyStore(targetPath, options)
  spinner.succeed(`Project initialization completed! 🎉`)
  spinner.succeed(`Run the following command installation dependence and start the project.
  - cd ${name}
  - pnpm install
  - pnpm run dev`)
}

/**
 * @param {string} packagePath
 * @param {string} name
 */
async function replacePackageJson(packagePath, name) {
  const dependenceList = ['micro-reactive']
  const packageJson = await fs.readJson(packagePath)
  const depVersions = await Promise.all(dependenceList.map(async (dep) => [dep, await latestPackageVersion(dep)]))
  depVersions.forEach(([dep, version]) => (packageJson.dependencies ??= {})[dep] = version)
  packageJson.name = name
  await fs.writeJson(packagePath, packageJson, { spaces: 2 })
}

/**
 * @param {string} targetPath
 * @param {Options}
 */
async function copyStore(targetPath, { store, frame }) {
  if (store !== 'none') {
    await compressing.tgz.uncompress(getPath('store', store), tmpdir)
    await fs.copy(path.join(tmpdir, store), path.resolve(targetPath, 'src/store'))
  }
  if (frame === 'native') {
    const counterTsPath = path.resolve(targetPath, 'src/counter.ts')
    const counterTs = await fs.readFile(counterTsPath, 'utf-8')
    const content = Mustache.render(counterTs, { isModuleStore: store === 'module' })
    await fs.writeFile(counterTsPath, content)
  }
}

/**
 * @param {string} packageName
 * @returns {Promise<string>}
 */
async function latestPackageVersion(packageName) {
  const packageUrl = `${registryUrl}/${packageName}`
  const { data } = await axios.get(packageUrl)
  return data['dist-tags'].latest
}
