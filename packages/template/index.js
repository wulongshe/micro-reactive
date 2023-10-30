const fs = require('fs-extra');
const path = require('path');
const compressing = require('compressing');
const axios = require('axios');
const inquirer = require('inquirer');
const ora = require('ora');

const latestLocalDir = path.resolve(__dirname, './package');
const latestLocalPath = fs.existsSync(latestLocalDir) ? latestLocalDir : path.resolve(__dirname);
const distPath = path.resolve(latestLocalPath, './dist');
const registryUrl = 'https://registry.npmjs.org';

/**
 * @param {string} type
 * @returns {string[]}
 */
module.exports.getNames = function (type) {
  return fs.readdirSync(path.join(distPath, type)).map((name) => name.split('.')[0]);
};

/**
 * @param {string} type
 * @param {string} name
 * @returns {string}
 */
module.exports.getPath = function (type, name) {
  return path.resolve(distPath, type, `${name}.tgz`);
};

/**
 * @param {string} version
 */
module.exports.refresh = async function () {
  if (!(await refreshPrompt())) return;

  const spinner = ora();
  spinner.start('Template update...');

  const packageInfo = await fetchPackageInfo();
  const latestVersion = packageInfo['dist-tags'].latest;
  const downloadUrl = packageInfo.versions[latestVersion].dist.tarball;
  const { data } = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
  await compressing.tgz.uncompress(Buffer.from(data), __dirname);
  spinner.succeed('Template update completed! 🎉');
};

module.exports.ensueLatest = async function () {
  const packageJsonPath = path.join(latestLocalPath, './package.json');
  const packageJson = await fs.readJSON(packageJsonPath);
  const packageInfo = await fetchPackageInfo();
  const latestVersion = packageInfo['dist-tags'].latest;
  return packageJson.version === latestVersion;
};

async function refreshPrompt() {
  const { refresh } = await inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'refresh',
        message: 'The template is not the latest version, do you want to update it?',
        default: false,
      },
    ])
    .catch(() => ({ refresh: false }));
  return refresh;
}

async function fetchPackageInfo() {
  const packageJsonPath = path.join(latestLocalPath, './package.json');
  const packageJson = await fs.readJSON(packageJsonPath);
  const packageUrl = `${registryUrl}/${packageJson.name}`;
  const { data } = await axios.get(packageUrl);
  return data;
}
