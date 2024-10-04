const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PHA = require('../models/risk.model'); // Adjust the path according to your structure
const dotenv = require('dotenv');
dotenv.config();
const { getPHAs, savePHAs } = require('../controllers/risk.controllers'); // Adjust the path according to your structure
const dbConnection= require('../config/db.config'); // Adjust the path according to your structure

dbConnection();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/phas/:id', async (req, res) => {
    try {
        const pha = await PHA.findById(req.params.id);
        if (!pha) return res.status(404).json({ message: 'PHA not found' });
        res.json(pha);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/api/phas', async (req, res) => {
    const startDate = "2000-01-01";
    const endDate = "2000-01-02";
    try {
        await savePHAs(startDate, endDate);
        res.json({ message: 'PHAs saved successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to save PHAs.' });
    }
});

app.get('/api/phas', async (req, res) => {
    try {
        const phas = await PHA.find();
        res.json(phas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
app.get('/api/phas/:startDate/:endDate', async (req, res) => {

    try {
        const phas = await getPHAs(req.params.startDate, req.params.endDate);
        res.json(phas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Export the app for Vercel
module.exports = app;
