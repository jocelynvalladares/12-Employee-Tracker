/**
 * /db/table_funcs/edit.js
 *
 * @description: all functionality for editing db here
 *
 */

// dependencies
const inquirer = require('inquirer');
const chalk = require('chalk');

// modules
const connection = require('../connection');
const { roleOptions, manOptions, empOptions, depOptions, prompts, optionsQuery } = require('../../lib/prompts');
const { depTitle, roleTitle, employeeTitle, launchTitle } = require('../../lib/title');

// for all edit queries. passed 5 arguments.
const update = (table, setProp, setVal, whereProp, whereVal, cb) => {
  let query = `UPDATE ${table}
  SET ${setProp} = ?
  WHERE ${whereProp} = ?`;

  connection.query(query, [setVal, whereVal], (err, res) => {
    err
      ? console.log(chalk.hex('#E47474').bgHex('#000000')("\n | Uh-Oh...Something's not right. Try again! | \n"))
      : console.log(
          chalk.hex('#85E474').bgHex('#000000')(
            '\n | Success! ' + setProp + ' has been changed to ' + setVal + ' at ' + whereVal + ' in the ' + table + ' table! | \n'
          )
        );
    cb();
  });
};

// logic for edits
const edit = (cb) => {
  inquirer.prompt(prompts[9]).then((res) => {
    console.clear();
    switch (res.select_table) {
      case 'employee':
        launchTitle(employeeTitle.hex, employeeTitle.text);
        optionsQuery(`SELECT CONCAT(last_name, ', ', first_name) AS name FROM employee;`, 'name', empOptions).then(() => {
          inquirer.prompt(prompts[5]).then((res) => {
            let emp = res.select_emp.split(',');
            connection.query(`SELECT id FROM employee WHERE last_name = ?`, emp[0], (err, res) => {
              let id = res[0].id;
              inquirer.prompt(prompts[13]).then((res) => {
                switch (res.emp_params) {
                  case 'first name':
                    inquirer.prompt(prompts[7]).then((res) => update('employee', 'first_name', res.first_name, 'id', id, cb));
                    break;
                  case 'last name':
                    inquirer.prompt(prompts[8]).then((res) => update('employee', 'last_name', res.last_name, 'id', id, cb));
                    break;
                  case 'role':
                    optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
                      inquirer.prompt(prompts[4]).then((res) => {
                        let role = res.select_role;
                        connection.query(`SELECT id FROM role WHERE title = ?`, role, (err, res) => {
                          update('employee', 'role_id', res[0].id, 'id', id, cb);
                        });
                      })
                    );
                    break;
                  case 'manager':
                    optionsQuery(
                      `SELECT first_name, last_name, CONCAT(last_name, ', ', first_name) AS manager FROM employee;`,
                      'manager',
                      manOptions
                    ).then(() => {
                      inquirer.prompt(prompts[6]).then((res) => {
                        let manager = res.select_mgmt.split(',');
                        connection.query(`SELECT id FROM employee WHERE last_name = ?`, manager[0], (err, res) => {
                          update('employee', 'manager_id', res[0].id, 'id', id, cb);
                          console.log(res[0].id);
                        });
                      });
                    });
                }
              });
            });
          });
        });
        break;
      case 'department':
        launchTitle(depTitle.hex, depTitle.text);
        optionsQuery(`SELECT name FROM department`, 'name', depOptions).then(() =>
          inquirer.prompt(prompts[3]).then((res) =>
            connection.query(`SELECT id FROM department WHERE name = "${res.select_dep}"`, (err, res) => {
              let id = res[0].id;
              inquirer.prompt(prompts[14]).then((res) => {
                let department = res.dep_input;
                update('department', 'name', department, 'id', id, cb);
              });
            })
          )
        );
        break;
      case 'role':
        launchTitle(roleTitle.hex, roleTitle.text);
        optionsQuery(`SELECT title FROM role`, 'title', roleOptions).then(() =>
          inquirer.prompt(prompts[4]).then((res) => {
            let role = res.select_role;
            connection.query(`SELECT id FROM role WHERE title = ?`, role, (err, res) => {
              let id = res[0].id;
              inquirer.prompt(prompts[15]).then((res) => {
                switch (res.role_input) {
                  case 'title':
                    inquirer.prompt(prompts[11]).then((res) => {
                      let title = res.title;
                      update('role', 'title', title, 'id', id, cb);
                    });
                    break;
                  case 'salary':
                    inquirer.prompt(prompts[12]).then((res) => {
                      let salary = res.salary;
                      update('role', 'salary', salary, 'id', id, cb);
                    });
                    break;
                  case 'department':
                    optionsQuery(`SELECT name FROM department`, 'name', depOptions).then(() =>
                      inquirer.prompt(prompts[3]).then((res) => {
                        connection.query(`SELECT id FROM department WHERE name = "${res.select_dep}"`, (err, res) => {
                          update('role', 'department_id', res[0].id, 'id', res[0].id, cb);
                        });
                      })
                    );
                    break;
                }
              });
            });
          })
        );
    }
  });
};

module.exports = { edit };