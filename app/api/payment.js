const { PaymentDao } = require('../infra');

const api = {}

api.list = async (req, res) => {
    console.log('####################################');
    console.log(`Listing payments`);

    const { page } = req.query;
    const payments = await new PaymentDao(req.db).listAll(page);
    res.json(payments); 
}

api.add = async (req, res) => {
    console.log('####################################');
    console.log('Received JSON data', req.body);
    const payment = req.body;
    const id = await new PaymentDao(req.db).add(payment);
    res.json(id);
};

api.update = async (req, res) => {
  console.log('####################################');
  console.log('Received JSON data', req.body);

  const { payment } = req.body;
  const dao = new PaymentDao(req.db);
  const paymentDB = await dao.findById(payment.id);
  if(!paymentDB) {
      const message = 'Payment does not exist';
      console.log(message);
      return res.status(404).json({ message });
  }

  await dao.update(payment.id, payment)
  console.log(`Payment ${payment.id} updated!`);
  res.status(200).end();
};

api.findById = async (req, res) => {
    console.log('####################################');
    console.log(`Finding payment for ID ${req.params.id}`)
    const payment = await new PaymentDao(req.db).findById(req.params.id);
    if(payment) {
        res.json(payment);
    } else {
        res.status(404).json({ message: 'Payment does not exist'})
    }  
};

api.remove = async (req, res) => { 
    const dao = new PaymentDao(req.db);
    const payment = await dao.findById(req.params.id);
    if(!payment) {
        const message = 'Payment does not exist';
        console.log(message);
        return res.status(404).json({ message });
    }

    await dao.remove(paymentId)
    console.log(`Payment ${paymentId} deleted!`);
    res.status(200).end();
};

module.exports = api;