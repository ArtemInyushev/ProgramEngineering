require('dotenv').config();

const sql = require("mssql/msnodesqlv8");

const config = {
    database: process.env.DB_NAME,
	server: process.env.DB_SERVER,
	driver: "msnodesqlv8",
	options: {
		trustedConnection: true
	}
};

const connectionPool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to database successfully');
        return pool;
    })
    .catch(err => {
        console.log(`Database Connection Failed!\n\n${err}\n\nProgram finished`);
        process.exit(1);
    });

const transformDataType = (type) => {
    switch(type) {
        case "string": return sql.NVarChar;
        default: return sql.Int;
    }
};

const runQuery = async (command) => {
    const pool = await connectionPool;
    return await pool.query(command);
    //const request = pool.request();
    //return await request.query(command);
};

const runPreparedQuery = async (query, args) => {
    let prepQuery = new sql.PreparedStatement(await connectionPool);
    Object.keys(args).forEach(arg => {
        prepQuery.input(arg, transformDataType(typeof args[arg]));
    })
    await prepQuery.prepare(query);
    let result = await prepQuery.execute({ ...args });
    await prepQuery.unprepare();

    return result;
};

process.on("beforeExit", async () => {
    const pool = await connectionPool;
    await pool.close();
});

module.exports = {
    runQuery,
    runPreparedQuery,
};