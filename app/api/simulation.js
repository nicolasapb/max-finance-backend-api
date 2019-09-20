const { SimulationDao } = require('../infra');

const api = {}

api.list = async (req, res) => {
    console.log('####################################');
    console.log(`Listing simulations`);

    const { page } = req.query;
    const simulations = await new SimulationDao(req.db).listAll(page);
    res.json(simulations); 
}

api.add = async (req, res) => {
    console.log('####################################');
    console.log('Received JSON data', req.body);
    const simulation = req.body;
    const id = await new SimulationDao(req.db).add(simulation);
    res.json(id);
};

api.update = async (req, res) => {
  console.log('####################################');
  console.log('Received JSON data', req.body);

  const { simulation } = req.body;
  const dao = new SimulationDao(req.db);
  const simulationDB = await dao.findById(simulation.id);
  if(!simulationDB) {
      const message = 'Simulation does not exist';
      console.log(message);
      return res.status(404).json({ message });
  }

  await dao.update(simulation.id, simulation)
  console.log(`Simulation ${simulation.id} updated!`);
  res.status(200).end();
};

api.findById = async (req, res) => {
    console.log('####################################');
    console.log(`Finding simulation for ID ${req.params.id}`)
    const simulation = await new SimulationDao(req.db).findById(req.params.id);
    if(simulation) {
        res.json(simulation);
    } else {
        res.status(404).json({ message: 'Simulation does not exist'})
    }  
};

api.remove = async (req, res) => { 
    const dao = new SimulationDao(req.db);
    const simulation = await dao.findById(req.params.id);
    if(!simulation) {
        const message = 'Simulation does not exist';
        console.log(message);
        return res.status(404).json({ message });
    }

    await dao.remove(simulationId)
    console.log(`Simulation ${simulationId} deleted!`);
    res.status(200).end();
};

module.exports = api;