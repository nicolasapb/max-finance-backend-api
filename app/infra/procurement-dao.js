const procurementConverter = row => ({
  id: row.procurement_id,
  product: row.procurement_product,
  amount: row.procurement_amount,
  link: row.procurement_link,
  img: row.procurement_img,
});

const maxRows = 30;

class procurementDao {

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
              FROM procurement
              ${limitQuery} ;
              `,
        (err, rows) => {
          const procurements = rows.map(procurementConverter)
          if (err) {
            console.log(err);
            return reject('Can`t list procurements');
          }
          console.log('procurements returned');
          resolve(procurements);
        });
    });
  }

  add(procurement) {
    return new Promise((resolve, reject) => {
      this._db.run(`
              INSERT INTO procurement (
                procurement_product,
                procurement_amount,
                procurement_link,
                procurement_img
              ) values (?,?,?,?)
          `,
        [
          procurement.product,
          procurement.amount,
          procurement.link,
          procurement.img
        ],
        (err) => {
          if (err) {
            console.log(err);
            return reject('Can`t add procurement');
          }
          resolve(this.lastID);
        });
    });
  }

  update(id, procurement) {
    return new Promise((resolve, reject) => {
      this._db.run(`
              UPDATE procurement SET            
                procurement_product  = ?,       
                procurement_amount   = ?,       
                procurement_link     = ?,     
                procurement_img      = ?     
                WHERE procurement_id = ?;   
          `,
        [
          procurement.product,
          procurement.amount,
          procurement.link,
          procurement.img,
          id
        ],
        (err) => {
          if (err) {
            console.log(err);
            return reject('Can`t update procurement');
          }
          resolve(this.lastID);
        });
    });
  }

  findById(id) {
    console.log(id);
    return new Promise((resolve, reject) => this._db.get(`
          SELECT *
          FROM procurement
          WHERE procurement_id = ?;
          `,
      [id],
      (err, row) => {
        if (err) {
          console.log(err);
          return reject('Can`t find procurement');
        }
        if (row) {
          resolve(procurementConverter(row));
        } else {
          resolve(null);
        }
      }
    ));
  }

  remove(id) {
    return new Promise((resolve, reject) => this._db.run(
      `DELETE FROM procurement WHERE procurement_id = ?`,
      [id],
      err => {
        if (err) {
          console.log(err);
          return reject('Can`t remove procurement');
        }
        resolve();
      }
    ));
  }
}

module.exports = procurementDao;