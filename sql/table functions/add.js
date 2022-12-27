/**
 * /db/table_funcs/add.js
 *
 * @description: all functionality for adding to db here
 *
 */

// dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');

// modules
const connection = require('../connection');
const { launchTitle, depTitle, roleTitle, employeeTitle } = require('../../lib/title');
const { roleOptions, manOptions, depOptions, prompts, optionsQuery } = require('../../lib/prompts');

// *** CONSTRUCTORS *** //

class Department {
  constructor(name) {
    this.name = name;
  }
  insert(cb) {
    let query = `INSERT INTO department(name)
    VALUES(?)`;
    connection.query(query, this.name, (err, res) => {
      err
        ? console.log(chalk.hex('#E47474').bgHex('#000000')("\n | Uh-Oh...Something's not right. Try again! | \n"))
        : console.log(chalk.hex('#85E474').bgHex('#000000')('\n | Success! ' + this.name + ' has been added to Departments! | \n'));
      cb();
    });
  }
}

class Employee {
  constructor(first_name, last_name, role_id, manager_id) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }
  insert(cb) {
    let query = `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;
    connection.query(query, [this.first_name, this.last_name, this.role_id, this.manager_id], (err, res) => {
      err
        ? console.log(chalk.hex('#E47474').bgHex('#000000')("\n | Uh-Oh...Something's not right. Try again! | \n"))
        : console.log(
            chalk.hex('#85E474').bgHex('#000000')('\n | Success! ' + this.last_name + ', ' + this.first_name + ' has been hired! | \n')
          );
      cb();
    });
  }
}

class Role {
  constructor(title, salary, department_id) {
    this.title = title;
    this.salary = salary;
    this.department_id = department_id;
  }
  insert(cb) {
    let query = `INSERT INTO role(title, salary, department_id)
    VALUES(?, ?, ?)`;
    connection.query(query, [this.title, this.salary, this.department_id], (err, res) => {
      err
        ? console.log(chalk.hex('#E47474').bgHex('#000000')("\n | Uh-Oh...Something's not right. Try again! | \n"), err)
        : console.log(
            chalk.hex('#85E474').bgHex('#000000')(
              '\n | Success! ' + this.title + ' has been added with a starting salary of ' + this.salary + '! | \n'
            )
          );
      cb();
    });
  }
}

const add = (cb) =>
  inquirer.prompt(prompts[9]).then((res) => {
    console.clear();
    switch (res.select_table) {
      case 'employee':
        let empProps = [];
        launchTitle(employeeTitle.hex, employeeTitle.text);
        inquirer.prompt(prompts[7]).then((res) => {
          empProps.push(res.first_name);
          inquirer.prompt(prompts[8]).then((res) => {
            empProps.push(res.last_name);
            optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() => {
              return inquirer.prompt(prompts[4]).then((res) => {
                let role = res.select_role;
                connection.query('SELECT id FROM role WHERE title = ?', role, (err, res) => {
                  empProps.push(res[0].id);
                });
                optionsQuery(
                  `SELECT first_name, last_name, CONCAT(last_name, ', ', first_name) AS manager FROM employee;`,
                  'manager',
                  manOptions
                ).then(() => {
                  inquirer.prompt(prompts[6]).then((res) => {
                    let manager = res.select_mgmt.split(',');
                    connection.query(`SELECT id FROM employee WHERE last_name = ?`, manager[0], (err, res) => {
                      empProps.push(res[0].id);
                      let newEmp = new Employee(empProps[0], empProps[1], empProps[2], empProps[3]);
                      newEmp.insert(cb);
                    });
                  });
                });
              });
            });
          });
        });
        break;
      case 'department':
        launchTitle(depTitle.hex, depTitle.text);
        inquirer.prompt(prompts[10]).then((res) => {
          let newDep = new Department(res.dep_name);
          newDep.insert(cb);
        });
        break;
      case 'role':
        let roleProps = [];
        launchTitle(roleTitle.hex, roleTitle.text);
        inquirer.prompt(prompts[11]).then((res) => {
          roleProps.push(res.title);
          inquirer.prompt(prompts[12]).then((res) => {
            roleProps.push(res.salary);
            optionsQuery(`SELECT name FROM department`, 'name', depOptions).then(() => {
              inquirer.prompt(prompts[3]).then((res) => {
                let department = res.select_dep;
                connection.query(`SELECT id FROM department WHERE name = "${department}"`, (err, res) => {
                  roleProps.push(res[0].id);
                  let newRole = new Role(roleProps[0], roleProps[1], roleProps[2]);
                  newRole.insert(cb);
                });
              });
            });
          });
        });
    }
  });

module.exports = { Department, Employee, Role, add };