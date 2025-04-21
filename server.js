const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const username = 'aprilianwi';
const password = 'wVvyDHZIXvZPRPHJ';
const cluster = 'cluster0'; // Assuming default cluster name, user can update if needed
const dbname = 'surveydb';

const uri = `mongodb+srv://${username}:${password}@${cluster}.1fkdnqx.mongodb.net/${dbname}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Define Mongoose schema and model for respondent and responses
const responseSchema = new mongoose.Schema({
  questionNumber: Number,
  answer: [String], // To support multiple answers for question 5
});

const respondentSchema = new mongoose.Schema({
  parentName: { type: String, required: true },
  childName: { type: String, required: true },
  phone: { type: String, required: true },
  responses: [responseSchema],
  createdAt: { type: Date, default: Date.now },
});

const Respondent = mongoose.model('Respondent', respondentSchema);

// API routes

// Submit survey
app.post('/api/survey', async (req, res) => {
  try {
    const { parentName, childName, phone, responses } = req.body;
    const respondent = new Respondent({
      parentName,
      childName,
      phone,
      responses,
    });
    await respondent.save();
    res.status(201).json({ message: 'Survey submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit survey' });
  }
});

// Get all respondents
app.get('/api/respondents', async (req, res) => {
  try {
    const respondents = await Respondent.find().sort({ createdAt: -1 });
    res.json(respondents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch respondents' });
  }
});

// Get respondent detail by id
app.get('/api/respondents/:id', async (req, res) => {
  try {
    const respondent = await Respondent.findById(req.params.id);
    if (!respondent) {
      return res.status(404).json({ error: 'Respondent not found' });
    }
    res.json(respondent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch respondent detail' });
  }
});

// Delete respondent by id
app.delete('/api/respondents/:id', async (req, res) => {
  try {
    const deleted = await Respondent.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Respondent not found' });
    }
    res.json({ message: 'Respondent deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete respondent' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
