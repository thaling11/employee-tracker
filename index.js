// Dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

//PORT
const PORT = process.env.PORT || 3002;
const app = express();

//Middleware for json and url encoded
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

//command line promps
function employeeStart() {
  inquirer.prompt({
    type: "list",
    message: "Welcome! Use the arrow keys to select.",
    name: "employeePromts",
    choices: [
      "View all employees",
      "View all departments",
      "View all roles",
      "Add an employee",
      "Add a department",
      "Add a role",
      "Update employee role",
      "Delete an employee",
      "EXIT",
    ]
  }).then((data) => {
        switch(data.employeePrompts) {
            case 'View all employees':
                viewEmployees();
                break;
        }
  })
};

//View employees function
const viewEmployees = () => {

};