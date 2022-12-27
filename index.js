/**
 * /index.js
 *
 * @description: index file is the main file. All functionality will come through this file.
 *
 */

// dependencies
const inquirer = require('inquirer');
const console_table = require('console.table');

// modules
const prompts = require('./lib/prompts');
const { viewTable } = require('./db/table_funcs/table_views');
const { add } = require('./db/table_funcs/add');
const { edit } = require('./db/table_funcs/edit');
const { remove } = require('./db/table_funcs/delete');

const init = () => {
  inquirer.prompt(prompts.prompts[0]).then((res) => {
    res.continue === true
      ? inquirer.prompt(prompts.prompts[1]).then((res) => {
          switch (res.main_menu) {
            case 'view':
              viewTable(init);
              break;
            case 'add':
              add(init);
              break;
            case 'edit':
              edit(init);
              break;
            case 'remove':
              remove(init);
              break;
          }
        })
      : process.exit(0);
  });
};

console.clear();
prompts.welcomePrompt();
init();