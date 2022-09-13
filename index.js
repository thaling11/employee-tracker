// Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

//Connection to mysql database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "lynnlax11",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function (err) {
  if (err) throw err;
  employeeStart();
});

//command line promps
function employeeStart() {
  inquirer
    .prompt({
      type: "list",
      message: "Welcome! Select from the following options.",
      name: "employeePrompts",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update employee role",
      ],
    })
    .then((results) => {
      switch (results.employeePrompts) {
        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Add a role":
          addRole();
          break;

        case "Add an employee":
          addEmployee();
          break;

        case "Udate employee role":
          updateEmployeeRole();
          break;
      }
    });
}

//View employees function
viewDepartments = () => {
const sql = `SElECT department.id, department.department_name FROM department`;
  db.query(sql, (err, results) => {
      if(err) throw err;
      console.table(results);
      employeeStart();
    }
  );
};

viewRoles = () => {
    const sql = `SELECT roles.title, roles.id, department.department_name AS department, roles.salary FROM roles
    INNER JOIN department ON roles.department_id = department.id`;
      db.query(sql, (err, results) => {
          if(err) throw err;
          console.table(results);
          employeeStart();
        }
      );
    };