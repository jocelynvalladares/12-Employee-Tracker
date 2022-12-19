/*==========================================================================
        Welcome to NSA's employee tracker! Just kidding.
==========================================================================*/
const inquirer = require("inquirer");
const manageDB = require("./manageDB");

// No really.
function NSAEmployeeTracker() {

    // This file prompts the user to add/delete/update employees/departments
    // from the sql database.

    inquirer
        .prompt([
            {
                type: "list",
                message: "Welcome to the Employee Database.",
                name: "mainMenu",
                choices: [
                    "View department list",
                    "View roles",
                    "View employee list",
                    "Add a department",
                    "Add a role",
                    "Add an employee",
                    "Update employee role",
                    "Update employee's manager",
                    "Remove a role from database",
                    "Remove employee from database",
                    "Exit"]
            },
        ])
        .then(function (response) {

            switch (response.mainMenu) {
                default:
                    text = "What did you do?! Now all of China knows you're here!";
                    break;
                //======================================================
                case "View department list":
                    manageDB.viewDept(function () {
                        //restart questions
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "View roles":
                    manageDB.viewRoles(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "View employee list":
                    manageDB.viewEmployees(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Add a department":
                    manageDB.createDept(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Add a role":
                    manageDB.createRole(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Add an employee":
                    manageDB.createEmployee(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Update employee role":
                    manageDB.updateEmployeeRole(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Update employee's manager":
                    manageDB.updateEmployeeManager(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Remove a role from database":
                    manageDB.removeRole(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Remove employee from database":
                    manageDB.removeEmployee(function () {
                        NSAEmployeeTracker();
                    });
                    break;
                //======================================================
                case "Exit":
                    console.log("Exiting employee database.");
                    manageDB.afterConnection(function () {
                        process.exit();
                    });
                    break;
            }
        });
};

NSAEmployeeTracker();