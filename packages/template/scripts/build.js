const compressing = require('compressing')
const fs = require('fs')
const path = require('path')

const publicPath = path.resolve(__dirname, '../public')
const distPath = path.resolve(__dirname, '../dist')

fs.existsSync(distPath) || fs.mkdirSync(distPath, { recursive: true })

Promise.all(fs.readdirSync(publicPath).map((name) => {
  const sourceModulePath = path.join(publicPath, name)
  const distModulePath = path.join(distPath, name)
  fs.existsSync(distModulePath) || fs.mkdirSync(distModulePath, { recursive: true })
  return Promise.all(fs.readdirSync(sourceModulePath).map(
    (templateName) => {
      const source = path.join(sourceModulePath, templateName)
      const target = path.join(distModulePath, `${templateName}.tgz`)
      return compressing.tgz.compressDir(source, target)
    }))
})).then(() => console.log('build success! 🎉'))
