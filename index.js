const mysql = require('mysql');
const inquirer = require("inquirer");
var figlet = require('figlet');
var quitNum = 0;

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

            default:
                connection.end();
                // quitNum = 1;
                break;
        }
        //    if(quitNum < 1) {askQuestions();}
    })
}

function getTableData(tableName) {
    connection.query('SELECT * FROM ' + tableName, function (err, data) {
        if (err) throw err;
        console.table(data);
        askQuestions();
    })
}

// function addEmployeeData() {
//     console.log("Creating a new employee...\n");
//     var query = connection.query(
//       "INSERT INTO employee SET ?",
//       {
//         first_name: "",
//         last_name: "",
//         role_id: "",
//         manager_id: ""
//       },
//       function(err, res) {
//         if (err) throw err;
//         console.log(res.affectedRows + " employee created!\n");
//         askQuestions();
//       }
//     );
//   }

function addRoleData() {
    connection.query('SELECT id,name FROM department', function (err, data) {
        if (err) throw err;
        console.log(data);

        inquirer.prompt({
            message: "which department?",
            type: "list",
            choices: data,
            name: "choice"
        }).then(answers => {
            console.log(answers.choice)
        })
    })
}

function addDepartmentData() {
    inquirer.prompt({
        type: "input",
        name: "deptname",
        message: "what department would you like to add?"
    }).then(function (response) {
        console.log('setting dept data');
        connection.query('INSERT INTO department (name) VALUES (?)', [response.deptname], function (err, data) {
            if (err) throw err;
            getTableData("department");
            // console.table(response.deptname + " added!");
            // askQuestions();
        })
    }
    );
}



//////////
function getArtistData() {
    inquirer.prompt({
        type: "input",
        name: "artist09iop",
        message: "who do we search for?"
    }).then(function (artistAnswers) {
        console.log('get artist data function');
        connection.query('SELECT * FROM top5000 WHERE artist = ?', [artistAnswers.artist], function (err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
        })
    })
}

function getSongData() {
    inquirer.prompt({
        type: "input",
        name: "song",
        message: "which song do we search for?"
    }).then(function (songAnswers) {
        console.log('get song data function');
        connection.query('SELECT * FROM top5000 WHERE song = ?', [songAnswers.song], function (err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
        })
    })
}

function getRangedData() {
    inquirer.prompt([
        {
            type: "number",
            name: "start",
            message: "which position to start at?"
        },
        {
            type: "number",
            name: "end",
            message: "which position to end at?"
        }
    ]).then(function (rangedAnswers) {
        console.log(rangedAnswers);
        connection.query('SELECT * FROM top5000 WHERE position BETWEEN ? AND ?', [rangedAnswers.start, rangedAnswers.end], function (err, data) {
            if (err) throw err;
            console.table(data);
            askQuestions();
        })
    })
}

function getMultiEntryArtistData() {
    connection.query(" SELECT artist, COUNT(artist) AS count FROM top5000 GROUP BY artist HAVING count>1 ORDER BY count DESC", function (err, data) {
        if (err) throw err;
        console.table(data);
    })
}