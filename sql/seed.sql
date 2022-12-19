/* ==================================================================================================================================
    Hard coding information; the joins will add departmentId, roleId, and managerId. For now, I need to hard-code the data to test.
================================================================================================================================== */
USE employeeDatabase;

INSERT INTO department
    (id, deptName)
VALUES
    (1, "Microbiology");

INSERT INTO department
    (id, deptName)
VALUES
    (2, "Chemistry");
INSERT INTO department
    (id, deptName)
VALUES
    (3, "Physics");

-- Adding role information. Last value relates to department table. --
INSERT INTO role
    (title, salary, departmentId)
VALUES("Microbiologist", 33296.53, 1);

INSERT INTO role
    (title, salary, departmentId)
VALUES("Chemist", 34596.02, 2);

INSERT INTO role
    (title, salary, departmentId)
VALUES("Physicist", 36521.47, 3);


-- Adding employee info. Last 2 values relate to role table. All managers have to go first or else the lesser employees don't have a manager.--
INSERT INTO employee
    (firstName, lastName, roleId)
VALUES("Anthony", "Garza", 1);

INSERT INTO employee
    (firstName, lastName, roleId)
VALUES("Brianna", "McCray", 2);

INSERT INTO employee
    (firstName, lastName, roleId)
VALUES("Kimi", "Inglet", 3);

/*================================================================*/

INSERT INTO employee
    (firstName, lastName, roleId, managerId)
VALUES("Crystal", "Ly", 1, 1);

INSERT INTO employee
    (firstName, lastName, roleId, managerId)
VALUES("Kurt", "LaVacque", 2, 2);

INSERT INTO employee
    (firstName, lastName, roleId, managerId)
VALUES("Justin", "Wofford", 3, 3);

/*================================================================*/

SELECT *
FROM department;
SELECT *
FROM role;
SELECT *
FROM employee;