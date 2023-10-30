const yargs = require('yargs');
const inquirer = require('inquirer');
const { getNames } = require('micro-reactive-template');

module.exports = class Command {
  static async create() {
    return new Promise((resolve, reject) => {
      yargs.command(
        ['create <name>', 'c'],
        'create a new project',
        (yargs) => {
          yargs.positional('name', {
            type: 'string',
            describe: 'project name',
          });
        },
        async (argv) => {
          const { name } = argv;

          const answer1 = await inquirer
            .prompt([
              {
                type: 'input',
                name: 'name',
                message: 'project name',
                default: name,
                validate(val) {
                  if (!/^[a-zA-Z\-]+$/.test(val)) {
                    return 'project name can only contain English and horizontal bar';
                  }
                  return true;
                },
              },
              {
                type: 'list',
                name: 'frame',
                message: 'frame language',
                choices: getNames('frame'),
              },
            ])
            .catch((error) => (reject(error), void 0));
          if (!answer1) return;

          const choices = answer1.frame === 'native' ? getNames('store') : ['none', ...getNames('store')];
          const answer2 = await inquirer
            .prompt([
              {
                type: 'list',
                name: 'store',
                message: 'store type',
                choices,
              },
            ])
            .catch((error) => (reject(error), void 0));
          if (!answer2) return;

          resolve({ ...answer1, ...answer2 });
        },
      ).argv;
    });
  }
  static async exists() {
    const { cover } = await inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'cover',
          message: 'The project already exists, do you want to overwrite it?',
          default: false,
        },
      ])
      .catch(() => ({ cover: false }));
    return cover;
  }
};
