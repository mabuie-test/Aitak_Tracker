require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const connectDB = require('./config/db');
const bootstrap = require('./routes/bootstrap');
const allRoutes = require('./routes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// health check
app.get('/health', (_, res) => res.sendStatus(200));

// bootstrap endpoint (use once)
app.use('/bootstrap', bootstrap);

// all API routes under /api
app.use('/api', allRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor rodando na porta ${PORT}`)
);
