const express = require('express');
const pool = require('./dbConnection');
const app = express();
/*
const { spawn } = require('child_process');
const scriptPath = 'C:/Users/João Victor/Desktop/Repo BD/database.sql';
const psql = spawn('psql', ['-d', 'project_db', '-f', scriptPath]);

psql.on('error', (err) => {
  console.error('Failed to start psql process', err);
});

psql.stderr.on('data', (data) => {
  console.error(`psql stderr: ${data}`);
});

psql.on('close', (code) => {
  if (code !== 0) {
    console.error(`psql process exited with code ${code}`);
  } else {
    console.log('Script executed successfully');
  }
});
*/

var variavel = "123";
variavel = 123;

app.use(express.json())

/**
 * QUERIES
*/

// CREATING DATA
// 

var clients = pool.query("INSERT INTO client (name, type, email, password) VALUES ('Leo', 'Client', 'leo@teste.com', 'password123');");
console.log(clients);
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});