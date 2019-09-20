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
CREATE TABLE IF NOT EXISTS payment (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_recipient VARCHAR(100) NOT NULL, 
    payment_due_date VARCHAR(10) NOT NULL,
    payment_amount VARCHAR(15) NOT NULL,
    payment_pay_date VARCHAR(10) NOT NULL,
    payment_pay_amount VARCHAR(15) NOT NULL,
    payment_auth VARCHAR(25) NOT NULL,
    payment_account VARCHAR(15) NOT NULL,
    payment_cnpj VARCHAR(18) NOT NULL,
    payment_type VARCHAR(1) NOT NULL,
    payment_paid INTEGER NOT NULL DEFAULT (0)
)
`;

const INSERT_DEFAULT_PAYMENT_1 = 
`
INSERT INTO payment (
    payment_recipient,
    payment_due_date,
    payment_amount,
    payment_pay_date,
    payment_pay_amount,
    payment_auth,
    payment_account,
    payment_cnpj,
    payment_type,
    payment_paid    
) SELECT 'MAXCASA XXVII EMP IMOB LTDA', '12/02/2019', '30000.00', '12/02/2019', '30000.00', 'MBB351FC703E985426DC491', '03500000207601', '13070428000152', '0', 1
    WHERE NOT EXISTS (SELECT * FROM payment WHERE payment_id = '1')
`;

const SAVING_SCHEMA =
`
CREATE TABLE IF NOT EXISTS saving (
    saving_id INTEGER PRIMARY KEY AUTOINCREMENT,
    saving_type VARCHAR(4) NOT NULL,
    saving_amount VARCHAR(15) NOT NULL,
    saving_date VARCHAR(10) NOT NULL,
    saving_simulation INTEGER NOT NULL DEFAULT (0)
);
`;

const INSERT_DEFAULT_SAVING_1 =
`
INSERT INTO saving (
    saving_type,
    saving_amount,
    saving_date,
    saving_simulation      
) SELECT 'PP', '5208.54', '01/01/2019', 0
    WHERE NOT EXISTS (SELECT * FROM saving WHERE saving_id = '1')
`;

const INSERT_DEFAULT_SAVING_2 =
`
INSERT INTO saving (
    saving_type,
    saving_amount,
    saving_date,
    saving_simulation      
) SELECT 'PP', '32000.00', '01/05/2020', 1
    WHERE NOT EXISTS (SELECT * FROM saving WHERE saving_id = '2')
`;

const SIMULATION_SCHEMA = `
CREATE TABLE IF NOT EXISTS simulation (
    simulation_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    simulation_composition VARCHAR(255) NOT NULL,
    simulation_total VARCHAR(15) NOT NULL,
    simulation_entry VARCHAR(15) NOT NULL,
    simulation_entry_pct VARCHAR(15) NOT NULL,
    simulation_funding VARCHAR(15) NOT NULL,
    simulation_funding_pct VARCHAR(15) NOT NULL,
    simulation_renovation VARCHAR(15) NOT NULL,
    simulation_installment VARCHAR(15) NOT NULL,
    simulation_fund_fees INTEGER NOT NULL DEFAULT (0),
    simulation_compose_income INTEGER NOT NULL DEFAULT (0),
    simulation_interest VARCHAR(15) NOT NULL,
    simulation_interest_am VARCHAR(15) NOT NULL,
    simulation_cet VARCHAR(15) NOT NULL,
    simulation_cesh VARCHAR(15) NOT NULL,
    simulation_term VARCHAR(15) NOT NULL,
    simulation_sim_date VARCHAR(10) NOT NULL
)
`;

const INSERT_DEFAULT_SIMULATION_1 =
`
INSERT INTO simulation (
    simulation_composition,
    simulation_total,
    simulation_entry,
    simulation_entry_pct,
    simulation_funding,
    simulation_funding_pct,
    simulation_renovation,
    simulation_installment,
    simulation_fund_fees,
    simulation_compose_income,
    simulation_interest,
    simulation_interest_am,
    simulation_cet,
    simulation_cesh,
    simulation_term,
    simulation_sim_date   
) SELECT 'FULL', '217689.00', '335689.00', '65.7700', '174692.00', '34.2300', '0', '1679.74', 0, 1, '7.9900', '0.6400', '8.6000', '2.4584', '35', '09/07/2019'
    WHERE NOT EXISTS (SELECT * FROM simulation WHERE simulation_id = '1')
`;

db.serialize(() => {
    db.run("PRAGMA foreign_keys=ON");
    db.run(USER_SCHEMA);
    db.run(INSERT_DEFAULT_USER_1);
    db.run(INSERT_DEFAULT_USER_2);
    db.run(PAYMENT_SCHEMA);        
    db.run(INSERT_DEFAULT_PAYMENT_1);        
    db.run(SAVING_SCHEMA);     
    db.run(INSERT_DEFAULT_SAVING_1);     
    db.run(INSERT_DEFAULT_SAVING_2);     
    db.run(SIMULATION_SCHEMA);        
    db.run(INSERT_DEFAULT_SIMULATION_1);        

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