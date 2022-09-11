DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(60),
    PRIMARY KEY(id)
);

CREATE TABLE roles (
    id INT NOT NULL,
    job_title VARCHAR(30),
    salary DECIMAL,
    department_id INT NOT NULL,
);

CREATE TABLE employee (
    id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    department VARCHAR(60) NOT NULL,
    salary INT NOT NULL,
    manager VARCHAR(60) NOT NULL
);