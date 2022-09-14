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
const viewDepartments = () => {
  const sql = `SElECT department.id, department.department_name FROM department`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    employeeStart();
  });
};

const viewRoles = () => {
  const sql = `SELECT roles.title, roles.id, department.department_name AS department, roles.salary FROM roles
    INNER JOIN department ON roles.department_id = department.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    employeeStart();
  });
};

const viewEmployees = () => {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, department.department_name AS department, roles.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee LEFT JOIN roles ON employee.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table(results);
    employeeStart();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "What department do you want to add?",
        validate: (addDepartment) => {
          if (addDepartment) {
            return true;
          } else {
            console.log("No input");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (department_name) VALUES (?)`;
      db.query(sql, answer.addDepartment, (err, result) => {
        if (err) throw err;
        console.log("New department added!");
        employeeStart();
      });
    });
};

const addRole = () => {
  const deptAry = [];
  db.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    res.forEach(dept => {
      let newDept = {
        name: dept.department_name,
        value: dept.id
      }
      deptAry.push(newDept);
    });

    let userInput = [
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?"
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?"
      },
      {
        type: "list",
        name: "department",
        choices: deptAry,
        message: "Which department is this role in?"
      }
    ];

    inquirer.prompt(userInput)
    .then(response => {
      const query = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
      db.query(query, [[response.title, response.salary, response.department]], (err, res) => {
        if (err) throw err;
        console.log('Successfully added a new role!');
        employeeStart();
      });
    })
    .catch(err => {
      console.error(err);
    });
  });
}

const addEmployee = () => {
  db.query('SELECT * FROM employee', (err, res) => {
    
  })
}