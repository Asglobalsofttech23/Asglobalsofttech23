const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path')
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host : '127.0.0.1',
    port : 3001,
    user : 'root',
    database : 'school_db'
});

db.connect((err) =>{
    if(err){
        console.error('Database connection failed: ' + err.stack);
    }else{
        console.log('Connected to the database');
    }
})

const studentController = require('./Controller/studentController')(db);
app.use('/students',studentController);

const classController = require('./Controller/classController')(db);
app.use('/class',classController);

const departmentController = require('./Controller/departmentController')(db);
app.use('/department',departmentController);

const roleController = require('./Controller/roleController')(db);
app.use('/role',roleController);


const staffController = require('./Controller/staffController')(db);
app.use('/staff',staffController);

const subjectController = require('./Controller/subjectController')(db);
app.use('/subject',subjectController);

const loginController = require('./Controller/loginController')(db);
app.use('/login',loginController)


const markController = require('./Controller/markController')(db);
app.use('/mark',markController)

app.listen(port,()=>{
    console.log(`Server is running on port${port}`)
})
