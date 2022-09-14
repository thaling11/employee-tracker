// Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { response } = require("express");

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

        case "Update employee role":
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
    res.forEach((dept) => {
      let newDept = {
        name: dept.department_name,
        value: dept.id,
      };
      deptAry.push(newDept);
    });

    let userInput = [
      {
        type: "input",
        name: "title",
        message: "What is the title of the new role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the new role?",
      },
      {
        type: "list",
        name: "department",
        choices: deptAry,
        message: "Which department is this role in?",
      },
    ];

    inquirer
      .prompt(userInput)
      .then((response) => {
        const query = `INSERT INTO roles (title, salary, department_id) VALUES (?)`;
        db.query(
          query,
          [[response.title, response.salary, response.department]],
          (err, res) => {
            if (err) throw err;
            console.log("Successfully added a new role!");
            employeeStart();
          }
        );
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

const addEmployee = () => {
  db.query("SELECT * FROM employee", (err, res_emp) => {
    if (err) throw err;
    const empManager = [
      {
        name: "None",
        value: 0,
      },
    ]; //an employee could have no manager
    res_emp.forEach(({ first_name, last_name, id }) => {
      empManager.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });
    db.query("SELECT * FROM roles", (err, res_role) => {
      if (err) throw err;
      const emplyRoleAry = [];
      res_role.forEach(({ title, id }) => {
        emplyRoleAry.push({
          name: title,
          value: id,
        });
      });

      let userPrompts = [
        {
          type: "input",
          name: "firstName",
          message: "What is the new employee's first name?",
        },
        {
          type: "input",
          name: "lastName",
          message: "What is the new employee's last name?",
        },
        {
          type: "list",
          name: "role",
          message: "What is the new employee's role?",
          choices: emplyRoleAry,
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the employee's manager?",
          choices: empManager,
        },
      ]

      inquirer.prompt(userPrompts)
      .then(response => {
        const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?)`;
        let manager_id = response.manager_id !== 0? response.manager_id: null;
        db.query(sql, [[response.first_name, response.last_name, response.role_id, manager_id]], (err, res) => {
          if (err) throw err;
          console.log("New employee added!");
          employeeStart();
        });
      })
      .catch(err => {
        console.error(err);
      });
  })
});
}

const updateEmployeeRole = () => {
  db.query("SELECT * FROM employee", (err, res_emp) => {
    if (err) throw err;
    const updatedEmp = [];
    console.log('hi');
    res_emp.forEach(({ first_name, last_name, id }) => {
      updatedEmp.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    //get all the role list to make choice of employee's role
    db.query("SELECT * FROM roles", (err, res_role) => {
      if (err) throw err;
      const updatedRole = [];
      res_role.forEach(({ title, id }) => {
        updatedRole.push({
          name: title,
          value: id
          });
        });
     
      let userPrompts = [
        {
          type: "list",
          name: "id",
          choices: updatedEmp,
          message: "Which employee role do you want to update?"
        },
        {
          type: "list",
          name: "role_id",
          choices: updatedRole,
          message: "What is the employee's new role?"
        }
      ]
      inquirer.prompt(userPrompts)
        .then(response => {
          const sql = `UPDATE EMPLOYEE SET ? WHERE ?? = ?;`;
          db.query(sql, [
            {role_id: response.role_id},
            "id",
            response.id
          ], (err, res) => {
            if (err) throw err;
            console.log("Updated employee's role!");
            employeeStart();
          });
        })
        .catch(err => {
          console.error(err);
        });
      })
  });
}
