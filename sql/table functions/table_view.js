/**
 * /db/table_funcs/table_views.js
 *
 * @description: table views
 *
 */

// dependencies
const inquirer = require('inquirer');
const connection = require('../connection');
const chalk = require('chalk');

// modules
const { roleOptions, manOptions, depOptions, prompts, optionsQuery } = require('../../lib/prompts');
const { launchTitle, depTitle, roleTitle, employeeTitle, mgmtTitle } = require('../../lib/title');

// display all employees
const empTable = (cb) => {
  let query = `SELECT employee.id, employee.last_name, employee.first_name, role.title, department.name AS department, CONCAT('$',role.salary) AS salary, CONCAT(manager.last_name, ', ', manager.first_name) AS manager 
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id`;

  let totalSal = `SELECT CONCAT('$', SUM(role.salary) OVER()) AS total_salary 
  FROM employee 
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  LIMIT 1`;

  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
  });

  connection.query(totalSal, (err, res) => {
    if (err) throw err;
    console.log(chalk.hex('#E47474').bgHex('#000000')('\n | Total Payroll: ' + res[0].total_salary + ' | \n'));
    cb();
  });
};

// display employees by department or role
const viewByTable = (column, val, cb) => {
  let query = `SELECT employee.id, employee.last_name, employee.first_name, role.title, department.name AS department, CONCAT('$',role.salary) AS salary, CONCAT(manager.last_name, ', ', manager.first_name) AS manager 
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager 
  ON manager.id = employee.manager_id
  WHERE ${column} = ?`;

  let totalSal = `SELECT CONCAT('$', SUM(role.salary) OVER())
  AS total_salary FROM employee
  LEFT JOIN role ON employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager ON manager.id = employee.manager_id
  WHERE ${column} = ?
  LIMIT 1;`;

  connection.query(query, val, (err, res) => {
    if (err) throw err;
    console.table(res);
  });

  connection.query(totalSal, val, (err, res) => {
    res == ''
      ? console.log(chalk.hex('#E47474').bgHex('#000000')('\n | Oops! No Employees Here Yet... | \n'))
      : console.log(chalk.hex('#E47474').bgHex('#000000')('\n | Total Payroll: ' + res[0].total_salary + ' | \n'));
    cb();
  });
};

// logic for if user selects view from main menu
const viewTable = (cb) =>
  inquirer.prompt(prompts[2]).then((res) => {
    console.clear();
    switch (res.select_view) {
      case 'employee':
        launchTitle(employeeTitle.hex, employeeTitle.text);
        empTable(cb);
        break;
      case 'department':
        launchTitle(depTitle.hex, depTitle.text);
        optionsQuery(`SELECT name FROM department`, 'name', depOptions).then((res) => {
          return inquirer.prompt(prompts[3]).then((res) => viewByTable('department.name', res.select_dep, cb));
        });
        break;
      case 'role':
        launchTitle(roleTitle.hex, roleTitle.text);
        optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() => {
          return inquirer.prompt(prompts[4]).then((res) => viewByTable('role.title', res.select_role, cb));
        });
        break;
      case 'manager':
        launchTitle(mgmtTitle.hex, mgmtTitle.text);
        optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS manager FROM employee`, 'manager', manOptions).then(() => {
          return inquirer.prompt(prompts[6]).then((res) => {
            let manager = res.select_mgmt.split(',');
            connection.query('SELECT id FROM employee WHERE last_name = ?', manager[0], (err, res) => {
              viewByTable('employee.manager_id', res[0].id, cb);
            });
          });
        });
        break;
    }
  });

module.exports = { empTable, viewByTable, viewTable };