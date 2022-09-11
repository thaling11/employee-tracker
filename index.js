// Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//Connection to mysql database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "lynnlax11",
    database: "employees_db"
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function(err) {
    if (err) throw err
    employeeStart();
});

//command line promps
function employeeStart() {
  inquirer
    .prompt({
      type: "list",
      message: "Welcome! Use the arrow keys to select.",
      name: "employeePromts",
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
    .then((data) => {
      switch (data.employeePrompts) {
        case "View all departments":
          viewDepartments();
          break;
      }
    });
}

//View employees function
const viewDepartments = () => {
  db.query("SElECT * FROM department", function (err, results) {
    console.log(results);
  });
};

