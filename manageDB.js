//===================================================================
//   There are definitely better software options than this below. //
//===================================================================

var mysql = require("mysql");
require("dotenv").config();
const consoleTable = require('console.table');
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: process.env.DB_PASSWORD,
    database: "employeeDatabase"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // After the connection, you must be able to go through any of the 
    // below functions before terminating the connection.
});

//======================================================================
//  Functions for SQL setting/updating/deleting based on user prompt  //
//======================================================================

// View department list
viewDept = (doneViewDeptCallback) => {
    console.log("Loading departments...\n");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) {
            console.error(err);
        } else {
            // Log all results of the SELECT statement
            console.table(res);
        }
        doneViewDeptCallback(err, res);
    });
};

// View roles
viewRoles = (doneViewRolesCallback) => {
    console.log("Loading all roles...\n");
    connection.query(`SELECT * FROM role
    INNER JOIN 
    department ON role.departmentId = department.id`, function (err, res) {
        if (err) {
            console.error(err)
        } else {
            console.table(res);
        }
        doneViewRolesCallback(err, res);
    }
    )
};

/* Reference from W3Schools
SELECT column_name(s)
FROM table1
INNER JOIN table2
ON table1.column_name = table2.column_name;
*/

// View employee list
viewEmployees = (doneViewEmployeeCallback) => {
    console.log("Loading all employees...\n");
    connection.query(`SELECT * FROM employee
      INNER JOIN	
    role ON employee.roleId = role.id
    INNER JOIN
    department ON role.departmentId = department.id
    `, function (err, res) {
        if (err) {
            console.error(err);
        } else {
            console.table(res);
        }
        doneViewEmployeeCallback(err, res);
    })
};

//===========================================================
// Add function to create department
//===========================================================
createDept = (doneCreateDeptCallback) => {
    console.log("Creating a new department...\n")
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the department name?"
        }
    ]).then(function (userInput) {
        connection.query("INSERT INTO department SET ?",
            {
                deptName: userInput.departmentName,
            },
            function () {
                console.log(`Department ${userInput.departmentName} was created successfully!`);
                // Displays table of departments.
                // This is NESTED SO MUCH
                viewDept(doneCreateDeptCallback);
            });
    })

};

// Add function to create role
createRole = (doneCreateRoleCallback) => {
    console.log("Creating a new role...")
    connection.query("SELECT * FROM role", function (err, res) {
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "What is the new role's Title?"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "What is the salary for this role?"
            },
            {
                name: "deptId",
                type: "number",
                message: "Which department ID does this role belong to?",
            }
        ]).then(function (userInput) {
            connection.query("INSERT INTO role SET ?",
                {
                    title: userInput.roleTitle,
                    salary: userInput.roleSalary,
                    departmentId: userInput.deptId
                },
                function () {
                    console.log(`Role ${userInput.roleTitle} was created successfully!`);
                    // displays table of roles
                    viewRoles(doneCreateRoleCallback);
                });
        })
    })

};

// Add function to create employee
// I deserve this pain for doing callbacks. FML
createEmployee = (doneCreateEmployeeCallback) => {
    console.log("Creating new employee data...")
    connection.query("SELECT * FROM employee", function (err, res) {
        console.table(res);
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "roleId",
                type: "input",
                message: "Which role does this employee belong to?"
            },
            {
                name: "managerId",
                type: "input",
                message: "Does this employee have a manager? If so, then input manager's employee ID. If not, press enter"
            }
        ]).then(function (userInput) {
            var data = {
                firstName: userInput.firstName,
                lastName: userInput.lastName,
                roleId: userInput.roleId
            }
            if (userInput.managerId) {
                data.managerId = userInput.managerId
            }
            connection.query("INSERT INTO employee SET ?",
                data,
                function (err, res) {
                    console.log('error:' + err);
                    console.log(`${userInput.firstName} ${userInput.lastName}'s profile was created successfully!`);
                    // displays the table of employees.
                    viewEmployees(doneCreateEmployeeCallback);
                });
        })
    })
};

//========================================================
// Add function to update employee role. WHAT THE EFFFF
//========================================================
function updateEmployeeRole(doneUpdateEmployeeRCallback) {
    // Must grab everything from employee table.
    connection.query("SELECT * FROM employee", function (err, res) {
        console.table(res);
        // Use the response to populate choices in prompt.
        inquirer.prompt(
            [
                { // Select an employee, then select by column what you want to change. 
                    name: "employeeId",
                    type: "number",
                    message: "Please input the id of the employee you want to update.",

                },
                {
                    name: "employeeUpdateRole",
                    type: "number",
                    message: "Please update employee's role by selecting a new role ID.",
                },

            ]).then((userInput) => {
                connection.query("UPDATE employee SET ? WHERE ?",
                    [
                        { roleId: userInput.employeeUpdateRole },
                        { id: userInput.employeeId }
                    ], function (err, res) {
                        console.log('error:' + err);
                        viewEmployees(doneUpdateEmployeeRCallback)
                    });
            })
    })
};

//===================================================
// Add function to update employee. WHAT THE EFFFF
//===================================================
function updateEmployeeManager(doneUpdateEmployeeMCallback) {
    // Must grab everything from employee table.
    connection.query("SELECT * FROM employee", function (err, res) {
        console.table(res);

        inquirer.prompt(
            [
                { // Select an employee, then select by column what you want to change. 
                    name: "employeeList",
                    type: "number",
                    message: "Please input the id of the employee you want to update.",
                },
                {
                    name: "employeeUpdateManager",
                    type: "number",
                    message: "Please update employee's manager by entering the manager's employee ID.",
                }

            ]).then((userInput) => {
                connection.query("UPDATE employee SET ? WHERE ?",
                    [
                        { managerId: userInput.employeeUpdateManager },
                        { id: userInput.employeeList }
                    ], function (err, res) {
                        console.log('error:' + err);
                        console.log(`Employee's manager was updated successfully!`);
                        viewEmployees(doneUpdateEmployeeMCallback)
                    }
                );
            })
    })
};

//======================================
// Add function to delete role
//======================================
removeRole = (doneRemoveRoleCallback) => {
    // Displays table of roles to reference when deleting roles.
    connection.query("SELECT * FROM role", function (err, res) {
        console.table(res);
        inquirer.prompt(
            {
                name: "removeRole",
                type: "number",
                message: "To remove a role from the database, please input the role ID. \n",
            })
            .then(function (userInput) {
                var newId = Number(userInput.removeRole);
                connection.query("DELETE FROM role WHERE ?", { id: newId }, function (err, res) {
                    console.log("Role has been purged from the database.");
                    // Displays table of roles.
                    viewRoles(doneRemoveRoleCallback);
                });
            })
    })
};


// Add function to delete employee
removeEmployee = (doneRemoveEmployeeCallback) => {
    // Provide a table of employees to reference when removing employees.
    connection.query("SELECT * FROM employee", function (err, res) {
        console.table(res);
        inquirer.prompt(
            {
                name: "removeEmployee",
                type: "number",
                message: "To remove an employee from the database, please input their employee ID. \n",

            })
            .then(function (userInput) {
                var newId = Number(userInput.removeEmployee);
                connection.query("DELETE FROM employee WHERE ?", { id: newId }, function (err, res) {
                    console.log("Employee has been purged from the database.");
                    // Displays table of employees.
                    viewEmployees(doneRemoveEmployeeCallback);
                });
            })
    })

};

//====================MAKE=IT=STOP=========================//
afterConnection = (exitCallback) => {
    // Closes connection after the query has finished.
    connection.end();
    exitCallback();
};

/*==========================================================================
             This creates an object that gets exported.
    It is a way to expose the functions in this file to the outside world
==========================================================================*/
module.exports = {
    "viewDept": viewDept,
    "viewRoles": viewRoles,
    "viewEmployees": viewEmployees,
    "createDept": createDept,
    "createRole": createRole,
    "createEmployee": createEmployee,
    "updateEmployeeRole": updateEmployeeRole,
    "updateEmployeeManager": updateEmployeeManager,
    "removeRole": removeRole,
    "removeEmployee": removeEmployee,
    "afterConnection": afterConnection
};