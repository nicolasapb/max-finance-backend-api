const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data.db');

const USER_SCHEMA = `
CREATE TABLE IF NOT EXISTS user (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_name VARCHAR(30) NOT NULL UNIQUE, 
    user_email VARCHAR(255) NOT NULL, 
    user_password VARCAHR(255) NOT NULL,
    user_full_name VARCAHR(40) NOT NULL, 
    user_join_date TIMESTAMP DEFAULT current_timestamp
)
`;

const INSERT_DEFAULT_USER_1 = 
`
INSERT INTO user (
    user_name, 
    user_email,
    user_password,
    user_full_name
) SELECT 'nicolas', 'nicolas@test.com', '123', 'Nicolas' WHERE NOT EXISTS (SELECT * FROM user WHERE user_name = 'nicolas')
`;

const INSERT_DEFAULT_USER_2 = 
`
INSERT INTO user (
    user_name, 
    user_email,
    user_password,
    user_full_name
) SELECT 'barbosa', 'barbosa@test.com', '123', 'Barbosa' WHERE NOT EXISTS (SELECT * FROM user WHERE user_name = 'barbosa')
`;

const PAYMENT_SCHEMA = 
`
CREATE TABLE IF NOT EXISTS photo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient VARCHAR(100) NOT NULL, 
    due_date VARCHAR(10) NOT NULL,
    amount VARCHAR(15) NOT NULL,
    pay_date VARCHAR(10) NOT NULL,
    pay_amount VARCHAR(15) NOT NULL,
    auth VARCHAR(25) NOT NULL,
    account VARCHAR(15) NOT NULL,
    cnpj VARCHAR(18) NOT NULL,
    type VARCHAR(1) NOT NULL,
    paid INTEGER NOT NULL DEFAULT (0),
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE 
)
`;

const SAVING_SCHEMA =
`
CREATE TABLE IF NOT EXISTS comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type VARCHAR(4) NOT NULL,
    amount VARCHAR(15) NOT NULL,
    date VARCHAR(10) NOT NULL,
    simulation INTEGER NOT NULL DEFAULT (0),
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE 
);
`;

const SIMULATION_SCHEMA = `
CREATE TABLE IF NOT EXISTS like (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    composition VARCHAR(255) NOT NULL
    total VARCHAR(15) NOT NULL
    entry VARCHAR(15) NOT NULL
    entry_pct VARCHAR(15) NOT NULL
    funding VARCHAR(15) NOT NULL
    funding_pct VARCHAR(15) NOT NULL
    renovation VARCHAR(15) NOT NULL
    installment VARCHAR(15) NOT NULL
    fund_fees INTEGER NOT NULL DEFAULT (0),
    compose_income INTEGER NOT NULL DEFAULT (0),
    interest VARCHAR(15) NOT NULL
    interest_am VARCHAR(15) NOT NULL
    cet VARCHAR(15) NOT NULL
    cesh VARCHAR(15) NOT NULL
    term VARCHAR(15) NOT NULL
    sim_date VARCHAR(10) NOT NULL
    user_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE 
)
`;

db.serialize(() => {
    db.run("PRAGMA foreign_keys=ON");
    db.run(USER_SCHEMA);
    db.run(INSERT_DEFAULT_USER_1);
    db.run(INSERT_DEFAULT_USER_2);
    db.run(PAYMENT_SCHEMA);        
    db.run(SAVING_SCHEMA);     
    db.run(SIMULATION_SCHEMA);        

    db.each("SELECT * FROM user", (err, user) => {
        console.log('Users');
        console.log(user);
    });
});

process.on('SIGINT', () =>
    db.close(() => {
        console.log('Database closed');
        process.exit(0);
    })
);

module.exports = db;