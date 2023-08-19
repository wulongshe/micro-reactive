const path = require('path')
const fs = require('fs-extra')
const ora = require('ora')
const Mustache = require('mustache')
const Command = require('./Command')

/**
 * @typedef {Object} Options
 * @property {string} name
 * @property {string} frame
 * @property {string} store
 */

/**
 * @param {Options} options
 */
module.exports = async function (options) {
  const { name, frame } = options
  const sourcePath = path.resolve(__dirname, '../templates')
  const targetPath = path.resolve(process.cwd(), name)

  if (await fs.exists(targetPath)) {
    if (!(await Command.exists())) return false
    await fs.remove(targetPath)
  }

  const spinner = ora()
  spinner.start('Project initialization...')
  await fs.copy(path.resolve(sourcePath, frame), targetPath)
  await replacePackageJson(path.resolve(targetPath, 'package.json'), name)
  await copyStore(sourcePath, targetPath, options)
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
  const packageJson = await fs.readJson(packagePath)
  packageJson.name = name
  packageJson.dependencies['micro-reactive'] = await require('./version')()
  await fs.writeJson(packagePath, packageJson, { spaces: 2 })
}

/**
 * @param {string} sourcePath
 * @param {string} targetPath
 * @param {Options}
 */
async function copyStore(sourcePath, targetPath, { store, frame }) {
  if (store !== 'none') {
    await fs.copy(path.resolve(sourcePath, 'store', store), path.resolve(targetPath, 'src/store'))
  }
  if (frame === 'native') {
    const counterTsPath = path.resolve(targetPath, 'src/counter.ts')
    const counterTs = await fs.readFile(counterTsPath, 'utf-8')
    const content = Mustache.render(counterTs, { isModuleStore: store === 'module' })
    await fs.writeFile(counterTsPath, content)
  }
}
