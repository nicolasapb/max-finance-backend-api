const { ProcurementDao } = require('../infra');

const api = {}

api.list = async (req, res) => {
    console.log('####################################');
    console.log(`Listing procurements`);

    const { page } = req.query;
    const procurements = await new ProcurementDao(req.db).listAll(page);
    res.json(procurements); 
}

api.add = async (req, res) => {
    console.log('####################################');
    console.log('Received JSON data', req.body);
    const procurement = req.body;
    const id = await new ProcurementDao(req.db).add(procurement);
    res.json(id);
};

api.update = async (req, res) => {
  console.log('####################################');
  console.log('Received JSON data', req.body);

  const procurement = req.body;
  const dao = new ProcurementDao(req.db);
  const procurementDB = await dao.findById(procurement.id);
  if(!procurementDB) {
      const message = 'Procurement does not exist';
      console.log(message);
      return res.status(404).json({ message });
  }

  await dao.update(procurement.id, procurement)
  console.log(`Procurement ${procurement.id} updated!`);
  res.status(200).end();
};

api.findById = async (req, res) => {
    console.log('####################################');
    console.log(`Finding procurement for ID ${req.params.id}`)
    const procurement = await new ProcurementDao(req.db).findById(req.params.id);
    if(procurement) {
        res.json(procurement);
    } else {
        res.status(404).json({ message: 'Procurement does not exist'})
    }  
};

api.remove = async (req, res) => { 
    const dao = new ProcurementDao(req.db);
    const procurement = await dao.findById(req.params.id);
    if(!procurement) {
        const message = 'Procurement does not exist';
        console.log(message);
        return res.status(404).json({ message });
    }

    await dao.remove(req.params.id)
    console.log(`Procurement ${req.params.id} deleted!`);
    res.status(200).end();
};

module.exports = api;