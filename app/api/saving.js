const { SavingDao } = require('../infra');

const api = {}

api.list = async (req, res) => {
    console.log('####################################');
    console.log(`Listing savings`);

    const { page } = req.query;
    const savings = await new SavingDao(req.db).listAll(page);
    res.json(savings); 
}

api.add = async (req, res) => {
    console.log('####################################');
    console.log('Received JSON data', req.body);
    const saving = req.body;
    const id = await new SavingDao(req.db).add(saving);
    res.json(id);
};

api.update = async (req, res) => {
  console.log('####################################');
  console.log('Received JSON data', req.body);

  const saving = req.body;
  const dao = new SavingDao(req.db);
  const savingDB = await dao.findById(saving.id);
  if(!savingDB) {
      const message = 'Saving does not exist';
      console.log(message);
      return res.status(404).json({ message });
  }

  await dao.update(saving.id, saving)
  console.log(`Saving ${saving.id} updated!`);
  res.status(200).end();
};

api.findById = async (req, res) => {
    console.log('####################################');
    console.log(`Finding saving for ID ${req.params.id}`)
    const saving = await new SavingDao(req.db).findById(req.params.id);
    if(saving) {
        res.json(saving);
    } else {
        res.status(404).json({ message: 'Saving does not exist'})
    }  
};

api.remove = async (req, res) => { 
    const dao = new SavingDao(req.db);
    const saving = await dao.findById(req.params.id);
    if(!saving) {
        const message = 'Saving does not exist';
        console.log(message);
        return res.status(404).json({ message });
    }

    await dao.remove(req.params.id)
    console.log(`Saving ${req.params.id} deleted!`);
    res.status(200).end();
};

module.exports = api;