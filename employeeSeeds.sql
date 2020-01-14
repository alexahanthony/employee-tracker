DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Marketing"), ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager",50000, 1), ("Sys/Ops",60000,2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Savannah","Martinez", 3, 10001), ("Rosaline","Douglass", 4, 57)