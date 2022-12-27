/**
 * /db/table_funcs/delete.js
 *
 * @description: all functionality for removing from db here
 *
 */

// dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');

// modules
const connection = require('../connection');
const { roleOptions, empOptions, depOptions, prompts, optionsQuery, removeOpt } = require('../../lib/prompts');
const { depTitle, roleTitle, employeeTitle, launchTitle } = require('../../lib/title');

// // delete query
const deleteQuery = (table, column, val, cb) => {
  connection.query(`DELETE FROM ${table} WHERE ${column} = ?`, val, (err, res) => {
    if (err) throw err;
    console.log(chalk.hex('#85E474').bgHex('#000000')('\n | ' + val + ' has been removed | \n'));
    cb();
  });
};

// logic for removing
const remove = (cb) => {
  inquirer.prompt(prompts[9]).then((res) => {
    console.clear();
    switch (res.select_table) {
      case 'employee':
        launchTitle(employeeTitle.hex, employeeTitle.text);
        optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS name FROM employee;`, 'name', empOptions).then(() =>
          inquirer.prompt(prompts[5]).then((res) => {
            let employee = res.select_emp.split(',');
            deleteQuery('employee', 'last_name', employee[0], cb);
            removeOpt(empOptions, res.select_emp);
          })
        );
        break;
      case 'department':
        launchTitle(depTitle.hex, depTitle.text);
        optionsQuery(`SELECT name FROM department`, 'name', depOptions)
          .then(() => inquirer.prompt(prompts[3]))
          .then((res) => {
            deleteQuery('department', 'name', res.select_dep, cb);
            removeOpt(depOptions, res.select_dep);
          });
        break;
      case 'role':
        launchTitle(roleTitle.hex, roleTitle.text);
        optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
          inquirer.prompt(prompts[4]).then((res) => {
            deleteQuery('role', 'title', res.select_role, cb);
            removeOpt(roleOptions, res.select_role);
          })
        );
        break;
    }
  });
};

module.exports = { remove };