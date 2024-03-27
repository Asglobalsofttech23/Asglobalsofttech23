// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mysql = require('mysql2');
// const path = require('path'); // Add this line
// const app = express();
// const port = 3001;


// app.use(cors()); // Enable CORS for all routes
// app.use(bodyParser.json());

// // Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const db = mysql.createConnection({
//   host: '127.0.0.1',
//   port: 3308,
//   user: 'root',
//   database: 'crm',
  
// });

// db.connect((err) => {
//   if (err) {
//     console.error('Database connection failed: ' + err.stack);
//     return;
//   }
//   console.log('Connected to the database');
// });




// const departmentController = require('./controllers/departmentController')(db);
// app.use('/departments',departmentController);

// const roleController = require('./controllers/roleController')(db);
// app.use('/roles',roleController);

// const employeeController = require('./controllers/employeeController')(db);
// app.use('/employees', employeeController);

// const customerController = require('./controllers/customerController')(db);
// app.use('/customers', customerController);

// const projectController = require('./controllers/projectController')(db);
// app.use('/project', projectController);

// const attendanceController = require('./controllers/attendaceController')(db);
// app.use('/attendance' , attendanceController);

// const taskController = require('./controllers/taskController')(db);
// app.use('/task',taskController);

// const subModuleController = require('./controllers/subModuleController')(db);
// app.use('/subModule',subModuleController);


// const moduleController = require('./controllers/moduleController')(db);
// app.use('/module',moduleController);

// const projectDashboardController = require('./controllers/projectDashboardController')(db);
// app.use('/projectDashboard',projectDashboardController);

// const smsController = require('./controllers/smsController')(db);
// app.use('/sms',smsController)

// const customerMaintenanceController = require('./controllers/customerMaintenanceController')(db);
// app.use('/custMain',customerMaintenanceController)


// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });







const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3001;
const axios = require('axios')
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '4CDX8ZB8vdon4RA.root',
  password: 'wUYML1SsbUnFnp05',
  database: 'crm',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Handle database connection errors
db.on('error', (err) => {
  console.error('Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // Reconnect on connection lost
    console.log('Reconnecting to the database...');
    db.getConnection((reconnectErr, connection) => {
      if (reconnectErr) {
        console.error('Reconnection failed:', reconnectErr);
      } else {
        console.log('Reconnected to the database');
        connection.release();
      }
    });
  } else {
    throw err;
  }
});

console.log('Connecting to the database...');

// Test the initial database connection
db.getConnection((connectErr, connection) => {
  if (connectErr) {
    console.error('Initial database connection failed:', connectErr);
    process.exit(1);
  } else {
    console.log('Connected to the database');
  



const departmentController = require('./controllers/departmentController')(db);
app.use('/departments',departmentController);

const roleController = require('./controllers/roleController')(db);
app.use('/roles',roleController);

const employeeController = require('./controllers/employeeController')(db);
app.use('/employees', employeeController);

const customerController = require('./controllers/customerController')(db);
app.use('/customers', customerController);

const projectController = require('./controllers/projectController')(db);
app.use('/project', projectController);

const attendanceController = require('./controllers/attendaceController')(db);
app.use('/attendance' , attendanceController);

const taskController = require('./controllers/taskController')(db);
app.use('/task',taskController);

const subModuleController = require('./controllers/subModuleController')(db);
app.use('/subModule',subModuleController);


const moduleController = require('./controllers/moduleController')(db);
app.use('/module',moduleController);

const projectDashboardController = require('./controllers/projectDashboardController')(db);
app.use('/projectDashboard',projectDashboardController);

const smsController = require('./controllers/smsController')(db);
app.use('/sms',smsController)

const customerMaintenanceController = require('./controllers/customerMaintenanceController')(db);
app.use('/custMain',customerMaintenanceController)


const marketingCustomerController = require('./controllers/marketingCustomerController')(db);
app.use('/marketing',marketingCustomerController)


app.get('/location', async (req, res) => {
  try {
      const { data } = await axios.get('https://ipinfo.io/json');
      const { loc } = data;
      const [latitude, longitude] = loc.split(',');
      const nominatimResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
      const { address } = nominatimResponse.data;
     
      console.log("city:", address);
      res.json({ address, latitude, longitude });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Release the initial connection
connection.release();
}
});



// app.get('/location', async (req, res) => {
//   try {
//       const { data } = await axios.get('https://ipinfo.io/json');
//       const { city, region, country, loc } = data;
//       const [latitude, longitude] = loc.split(',');
//       console.log("City:", city);
//       console.log("Region:", region);
//       console.log("Country:", country);
//       console.log("Latitude:", latitude);
//       console.log("Longitude:", longitude);
//       res.json({ city, region, country, latitude, longitude });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//   }
// });





