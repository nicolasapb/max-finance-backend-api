const simulationConverter = row => ({
  id: row.simulation_id,
  composition: row.simulation_composition,
  total: row.simulation_total,
  entry: row.simulation_entry,
  entryPct: row.simulation_entry_pct,
  funding: row.simulation_funding,
  fundingPct: row.simulation_funding_pct,
  renovation: row.simulation_renovation,
  installment: row.simulation_installment,
  fundFees: row.simulation_fund_fees == 1 ? true : false,
  composeIncome: row.simulation_compose_income == 1 ? true : false,
  interest: row.simulation_interest,
  interestAM: row.simulation_interest_am,
  cet: row.simulation_cet,
  cesh: row.simulation_cesh,
  term: row.simulation_term,
  simDate: row.simulation_sim_date
});

const maxRows = 30;

class SimulationDao {

  constructor(db) {
    this._db = db;
  }

  listAll(page) {

    const from = (page - 1) * maxRows;

    let limitQuery = '';

    if (page) limitQuery = `LIMIT ${from}, ${maxRows}`;

    return new Promise((resolve, reject) => {
      this._db.all(`
              SELECT *
              FROM simulation
              ${limitQuery} ;
              `,
        (err, rows) => {
          console.log(rows);
          const simulations = rows.map(simulationConverter)
          if (err) {
            console.log(err);
            return reject('Can`t list simulations');
          }
          console.log('simulations returned');
          resolve(simulations);
        });
    });
  }

  add(simulation) {
    return new Promise((resolve, reject) => {
      this._db.run(`
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
              ) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          `,
        [
          simulation.composition,
          simulation.total,
          simulation.entry,
          simulation.entryPct,
          simulation.funding,
          simulation.fundingPct,
          simulation.renovation,
          simulation.installment,
          simulation.fundFees ? 1 : 0,
          simulation.composeIncome ? 1 : 0,
          simulation.interest,
          simulation.interestAM,
          simulation.cet,
          simulation.cesh,
          simulation.term,
          simulation.simDate
        ],
        (err) => {
          if (err) {
            console.log(err);
            return reject('Can`t add simulation');
          }
          resolve(this.lastID);
        });
    });
  }

  update(id, simulation) {
    return new Promise((resolve, reject) => {
      this._db.run(`
              UPDATE simulation SET            
                simulation_composition = ?,  
                simulation_total = ?,
                simulation_entry = ?,
                simulation_entry_pct = ?,
                simulation_funding = ?,
                simulation_funding_pct = ?,
                simulation_renovation = ?,
                simulation_installment = ?,
                simulation_fund_fees = ?,
                simulation_compose_income = ?,
                simulation_interest = ?,
                simulation_interest_am = ?,
                simulation_cet = ?,
                simulation_cesh = ?,
                simulation_term = ?,
                simulation_sim_date = ?    
                WHERE simulation_id = ?;   
          `,
        [
          simulation.composition,
          simulation.total,
          simulation.entry,
          simulation.entryPct,
          simulation.funding,
          simulation.fundingPct,
          simulation.renovation,
          simulation.installment,
          simulation.fundFees ? 1 : 0,
          simulation.composeIncome ? 1 : 0,
          simulation.interest,
          simulation.interestAM,
          simulation.cet,
          simulation.cesh,
          simulation.term,
          simulation.simDate,
          id
        ],
        (err) => {
          if (err) {
            console.log(err);
            return reject('Can`t update simulation');
          }
          resolve(this.lastID);
        });
    });
  }

  findById(id) {
    console.log(id);
    return new Promise((resolve, reject) => this._db.get(`
          SELECT *
          FROM simulation
          WHERE simulation_id = ?;
          `,
      [id],
      (err, row) => {
        if (err) {
          console.log(err);
          return reject('Can`t find simulation');
        }
        if (row) {
          resolve(simulationConverter(row));
        } else {
          resolve(null);
        }
      }
    ));
  }

  remove(id) {
    return new Promise((resolve, reject) => this._db.run(
      `DELETE FROM simulation WHERE simulation_id = ?`,
      [id],
      err => {
        if (err) {
          console.log(err);
          return reject('Can`t remove simulation');
        }
        resolve();
      }
    ));
  }
}

module.exports = SimulationDao;