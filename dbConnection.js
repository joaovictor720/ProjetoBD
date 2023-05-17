const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgres://iwizdriu:J7sDDE3Dx8x6wd0Gnq1WuasVxbos7_Ig@babar.db.elephantsql.com/iwizdriu'
});

module.exports = pool