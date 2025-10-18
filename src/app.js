const express = require('express');
const bodyParser = require('body-parser');
const ProvisionController = require('./controllers/provisionController');
const AWS_Factory = require('./factories/awsFactory');
const Azure_Factory = require('./factories/azureFactory');
const GCP_Factory = require('./factories/gcpFactory');
const OnPremise_Factory = require('./factories/onPremiseFactory');

const app = express();
app.use(bodyParser.json());

const factories = {
  aws: new AWS_Factory(),
  azure: new Azure_Factory(),
  gcp: new GCP_Factory(),
  onpremise: new OnPremise_Factory()
};

const controller = new ProvisionController(factories);

app.post('/api/v1/provision', async (req, res) => {
  try {
    const { provider, builderType, choice, specs } = req.body;
    const result = await controller.provision(provider, builderType, choice, specs);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
});

app.post('/api/v1/template', (req, res) => {
  try {
    const { name, infra } = req.body;
    const out = controller.saveTemplate(name, infra);
    res.json(out);
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
});

app.post('/api/v1/template/clone', async (req, res) => {
  try {
    const { name, overrides } = req.body;
    const result = await controller.cloneTemplate(name, overrides || {});
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
