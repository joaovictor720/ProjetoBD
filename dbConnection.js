const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    password: 'MIsoou258',
    database: 'project_db',
    host: 'localhost',
    port: 5432
})

module.exports = pool