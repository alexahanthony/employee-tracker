const mysql = require('mysql');
const inquirer = require("inquirer");
var figlet = require('figlet');

//cool name creator thing in node
figlet('Alexas Employee Tracker', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

//connecting to mysql
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    askQuestions();
});

function askQuestions() {
    inquirer.prompt({
        message: "what would you like to do?",
        type: "list",
        choices: [
            "add employees",
            "add roles",
            "add departments",
            "view employees",
            "view roles",
            "view departments",
            "update employee role",
            "QUIT"
        ],
        name: "choice"
    }).then(answers => {
        switch (answers.choice) {
            case "add employees":
                addEmployeeData()
                break;

            case "add roles":
                addRoleData()
                break;

            case "add departments":
                addDepartmentData()
                break;

            case "view employees":
                getTableData("employee")
                break;

            case "view roles":
                getTableData("role")
                break;

            case "view departments":
                getTableData("department")
                break;

            case "update employee role":
                updateEmployeeRole()
                break;

            default:
                connection.end();
                break;
        }
    })
}

function getTableData(tableName) {
    connection.query('SELECT * FROM ' + tableName, function (err, data) {
        if (err) throw err;
        console.table(data);
        askQuestions();
    })
}

function addEmployeeData() {
    let firstName = "";
    let lastName = "";
    let roleId = "";
    let managerId = "";
    inquirer.prompt({
        type: "input",
        name: "firstname",
        message: "what is the employee FIRST NAME?"
    }).then(answers => {
        firstName = answers.firstname;
        inquirer.prompt({
            type: "input",
            name: "lastname",
            message: "what is the employee LAST NAME?"
        }).then(answers => {
            lastName = answers.lastname;
            connection.query('SELECT title FROM role', function (err, data) {
                if (err) throw err;
                inquirer.prompt({
                    message: "which role?",
                    type: "list",
                    choices: data.map(a => a.title),
                    name: "choice"
                }).then(answers => {
                    connection.query('SELECT id FROM role WHERE title = ?', [answers.choice], function (err, data) {
                        if (err) throw err;
                        roleId = data[0].id;
                        connection.query('SELECT first_name FROM employee', function (err, data) {
                            if (err) throw err;
                            inquirer.prompt({
                                message: "which boss?",
                                type: "list",
                                choices: data.map(a => a.first_name),
                                name: "choice"
                            }).then(answers => {
                                connection.query('SELECT id FROM employee WHERE first_name = ?', [answers.choice], function (err, data) {
                                    if (err) throw err;
                                    managerId = data[0].id;
                                    connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("' + firstName + '","' + lastName + '","' + roleId + '","' + managerId + '")', function (err, data) {
                                        if (err) throw err;
                                        getTableData("employee")
                                    })
                                })
                            })
                        })
                    })
                });
            })
        })
    })
}

function addRoleData() {
    let roleTitle = "";
    let salary = "";
    let deptId = "";
    inquirer.prompt({
        type: "input",
        name: "role",
        message: "what role would you like to add?"
    }).then(answers => {
        roleTitle = answers.role;
        inquirer.prompt({
            type: "input",
            name: "salary",
            message: "what salary is this role?"
        }).then(answers => {
            salary = answers.salary;
            connection.query('SELECT name FROM department', function (err, data) {
                if (err) throw err;
                console.log(data)
                inquirer.prompt({
                    message: "which department?",
                    type: "list",
                    choices: data,
                    name: "choice"
                }).then(answers => {
                    connection.query('SELECT id FROM department WHERE name = ?', [answers.choice], function (err, data) {
                        if (err) throw err;
                        deptId = data[0].id;
                        connection.query('INSERT INTO role (title, salary, department_id) VALUES ("' + roleTitle + '","' + salary + '","' + deptId + '")', function (err, data) {
                            if (err) throw err;
                            getTableData("role")
                        })
                    })
                })
            })
        })
    });
}

function addDepartmentData() {
    inquirer.prompt({
        type: "input",
        name: "deptname",
        message: "what department would you like to add?"
    }).then(function (response) {
        connection.query('INSERT INTO department (name) VALUES (?)', [response.deptname], function (err, data) {
            if (err) throw err;
            getTableData("department");
        })
    }
    );
}