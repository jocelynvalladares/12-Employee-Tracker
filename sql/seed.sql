-- department table
INSERT INTO department(name)
VALUES
("Writing"), 
("Performance"), 
("Executive"), 
("Production");

-- role table
INSERT INTO role(title, salary, department_id)
VALUES
-- writing
("Head Writer", 500000.00, 1),
("Writer", 200000.00, 1),
("Assistant", 65000.00, 1),
-- performance
("Actor", 1000000.00, 2),
-- executive
("VP TV & Microwave Programming", 9000000.00, 3),
("CEO", 9999999.99, 3),
("VP News & Theme Park Talent", 3000000.00, 3),
("Assistant", 100000.00, 3),
("Page", 50000.00, 3),
-- production
("Producer", 500000.00, 4);

-- employee table
INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
-- writing
("Liz", "Lemon", 1, 8),
("Frank", "Rossitano", 2, 1),
("Toofer", "Spurlock", 2, 1),
("Johnny", "Lutz", 2, 1),
("Cerie", "Xerox", 3, 1),
-- performance
("Jenna", "Maroney", 4, 13),
("Tracey", "Jordan", 4, 13),
-- executive
("Jack", "Donaghy", 5, 9),
("Don", "Geiss", 6, NULL),
("Devon", "Banks", 7, 9),
("Jonathan", "Pancholy", 8, 8),
("Kenneth", "Parcell", 9, 8),
-- production
("Pete", "Hornberger", 10, 8);