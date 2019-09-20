const savingConverter = row => ({
  id: row.saving_id,
  type: row.saving_type,
  amount: row.saving_amount,
  date: row.saving_date,
  simulation: row.saving_simulation == 1 ? true : false,
});

const maxRows = 30;

class SavingDao {

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
              FROM saving
              ${limitQuery} ;
              `,
        (err, rows) => {
          console.log(rows);
          const savings = rows.map(savingConverter)
          if (err) {
            console.log(err);
            return reject('Can`t list savings');
          }
          console.log('savings returned');
          resolve(savings);
        });
    });
  }

  add(saving) {
    return new Promise((resolve, reject) => {
      this._db.run(`
              INSERT INTO saving (
                saving_type,
                saving_amount,
                saving_date,
                saving_simulation
              ) values (?,?,?,?)
          `,
        [
          saving.type,
          saving.amount,
          saving.date,
          saving.simulation ? 1 : 0
        ],
        (err) => {
          if (err) {
            console.log(err);
            return reject('Can`t add saving');
          }
          resolve(this.lastID);
        });
    });
  }

  update(id, saving) {
    return new Promise((resolve, reject) => {
      this._db.run(`
              UPDATE saving SET            
                saving_type       = ?       
                saving_amount     = ?       
                saving_date       = ?     
                saving_simulation = ?     
                WHERE saving_id = ?;   
          `,
        [
          saving.type,
          saving.amount,
          saving.date,
          saving.simulation ? 1 : 0,
          id
        ],
        (err) => {
          if (err) {
            console.log(err);
            return reject('Can`t update saving');
          }
          resolve(this.lastID);
        });
    });
  }

  findById(id) {
    console.log(id);
    return new Promise((resolve, reject) => this._db.get(`
          SELECT *
          FROM saving
          WHERE saving_id = ?;
          `,
      [id],
      (err, row) => {
        if (err) {
          console.log(err);
          return reject('Can`t find saving');
        }
        if (row) {
          resolve(savingConverter(row));
        } else {
          resolve(null);
        }
      }
    ));
  }

  remove(id) {
    return new Promise((resolve, reject) => this._db.run(
      `DELETE FROM saving WHERE saving_id = ?`,
      [id],
      err => {
        if (err) {
          console.log(err);
          return reject('Can`t remove saving');
        }
        resolve();
      }
    ));
  }
}

module.exports = SavingDao;