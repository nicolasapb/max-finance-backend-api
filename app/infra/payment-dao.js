const paymentConverter = row => ({
  id: row.payment_id, 
  recipient: row.payment_recipient, 
  dueDate: row.payment_due_date, 
  amount: row.payment_amount, 
  payDate: row.payment_pay_date, 
  payAmount: row.payment_pay_amount, 
  auth: row.payment_auth, 
  account: row.payment_account, 
  cnpj: row.payment_cnpj, 
  type: row.payment_type, 
  paid: row.payment_paid == 1 ? true : false, 
});


const maxRows = 30;

class PaymentDao {

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
              FROM payment
              ${limitQuery} ;
              `,
              (err, rows) => {
                  console.log(rows);
                  const payments = rows.map(paymentConverter)
                  if (err) {
                      console.log(err);
                      return reject('Can`t list payments');
                  }
                  console.log('payments returned');
                  resolve(payments);
              });
      });
  }

  add(payment) {
      return new Promise((resolve, reject) => {
          this._db.run(`
              INSERT INTO payment (
                payment_recipient
                payment_due_date
                payment_amount
                payment_pay_date
                payment_pay_amount
                payment_auth
                payment_account
                payment_cnpj
                payment_type
                payment_paid
              ) values (?,?,?,?,?,?,?,?,?,?)
          `,
              [
                payment.recipient,
                payment.dueDate,
                payment.amount,
                payment.payDate,
                payment.payAmount,
                payment.auth,
                payment.account,
                payment.cnpj,
                payment.type,
                payment.paid ? 1 : 0
              ],
              (err) => {
                  if (err) {
                      console.log(err);
                      return reject('Can`t add payment');
                  }
                  resolve(this.lastID);
              });
      });
  }

  update(id, payment) {
      return new Promise((resolve, reject) => {
          this._db.run(`
              update payment set            
                payment_recipient  = ?       
                payment_due_date   = ?       
                payment_amount     = ?     
                payment_pay_date   = ?       
                payment_pay_amount = ?         
                payment_auth       = ?   
                payment_account    = ?     
                payment_cnpj       = ?   
                payment_type       = ?   
                payment_paid       = ?
                where payment_id = ?;   
          `,
              [
                payment.recipient,
                payment.dueDate,
                payment.amount,
                payment.payDate,
                payment.payAmount,
                payment.auth,
                payment.account,
                payment.cnpj,
                payment.type,                
                payment.paid ? 1 : 0,
                id
              ],
              (err) => {
                  if (err) {
                      console.log(err);
                      return reject('Can`t update payment');
                  }
                  resolve(this.lastID);
              });
      });
  }  

  findById(id) {
    console.log(id);
      return new Promise((resolve, reject) => this._db.get(`
          SELECT  p.*
          FROM payment AS p
          WHERE p.payment_id = ?;
          `,
          [id],
          (err, row) => {
              if (err) {
                  console.log(err);
                  return reject('Can`t find payment');
              }
              if (row) {
                  resolve(paymentConverter(row));
              } else {
                  resolve(null);
              }
          }
      ));
  }

  remove(id) {
      return new Promise((resolve, reject) => this._db.run(
          `DELETE FROM payment where payment_id = ?`,
          [id],
          err => {
              if (err) {
                  console.log(err);
                  return reject('Can`t remove payment');
              }
              resolve();
          }
      ));
  }
}

module.exports = PaymentDao;