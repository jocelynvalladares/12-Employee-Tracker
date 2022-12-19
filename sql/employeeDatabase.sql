/* =======================================================
    Welcome to my Employee Tracker Database!
        Based on node.js and uses mySQL to maintain
        the database. -Crystal
======================================================== */

DROP DATABASE IF EXISTS employeeDatabase;

CREATE DATABASE employeeDatabase;

USE employeeDatabase;

CREATE TABLE department
(
    -- Department ID and name. --
    id INT NOT NULL
    AUTO_INCREMENT PRIMARY KEY,
    deptName VARCHAR
    (30) NOT NULL
);

    CREATE TABLE role
    (
        -- Employee roles, like Microbiologist, Manager... --
        id INT NOT NULL
        AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR
        (30),
        salary DECIMAL
        (10, 2),
        -- Related to department ID in department table. A foreign key! --
        departmentId INT,
        FOREIGN KEY
        (departmentId)
        REFERENCES department
        (id)
        -- On delete cascade will delete the department all the way down (cascading) the tables that reference that specific dept id. --
        ON
        DELETE CASCADE
        ON
        UPDATE NO ACTION
    );

        CREATE TABLE employee
        (
            id INT
            AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR
            (30),
        lastName VARCHAR
            (30),

        -- Foreign keys below--
        roleId INT,
        FOREIGN KEY
            (roleId)
        REFERENCES role
            (id)
        ON
            DELETE CASCADE
        ON
            UPDATE NO ACTION,

        -- This id is referencing another employee's id; the manager of this particular employee. --
        managerId INT,
        FOREIGN KEY
            (managerId)
        REFERENCES employee
            (id)
        ON
            DELETE CASCADE
        ON
            UPDATE NO ACTION
    );