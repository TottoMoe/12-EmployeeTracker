const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  console.log("MySql Connected!!!");

  promptInit();
});

function promptInit() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "request",
        message: "Please select the following option",
        choices: [
          "View all departments",
          "View all role",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      },
    ])
    .then(function (res) {
      switch (res.request) {
        case "View all departments":
          viewDepartments();
          break;
        case "View all role":
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
        case "Update an employee role":
          updateEmployee();
          break;
        default:
          exit();
      }
    });
}

function viewDepartments() {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) throw err;
    console.table(results);
    promptInit();
  });
}

function viewRoles() {
  db.query(
    `SELECT role.id, role.title, role.salary, department.name AS Department FROM role LEFT JOIN department ON role.department_id = department.id;`,
    function (err, results) {
      if (err) throw err;
      console.table(results);
      promptInit();
    }
  );
}

function viewEmployees() {
  db.query(`SELECT 
    employee.id, 
    employee.first_name AS First_Name, 
    employee.last_name AS Last_Name,
    role.title AS Title,
      role.department_id AS Department,
      role.salary AS salary,
      employee.manager_id AS Manager
  FROM employee
  LEFT JOIN role ON employee.role_id = role.id
  LEFT JOIN department on role.department_id = department.id;`, 
  function (err, results) {
    if (err) throw err;
    console.table(results);
    promptInit();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please enter the new department name.",
      },
    ])
    .then(function (answer) {
      db.query(
        `INSERT INTO department(name) VALUES (?);`, // role: INSERT INTO role(tile,salry, depart_id) VALUES (?, ?, ?)
        [answer.department], // role [1,2,3]
        function (err) {
          if (err) throw err;
          console.log("Departments updated with " + answer.department);
          promptInit();
        }
      );
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "Enter a role title:",
      },
      {
        name: "salary",
        type: "number",
        message: "Enter the role salary",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
      {
        name: "department_id",
        type: "number",
        message: "Enter department id",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      db.query(
        "INSERT INTO role SET ?",
        {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.department_id,
        },
        function (err) {
          if (err) throw err;
          console.log("Emoloyee Roles added " + answer.role);
          promptInit();
        }
      );
    });
}

function addEmployee() {}

function updateEmployee() {}

function exit() {}
