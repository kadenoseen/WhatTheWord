require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 5000;

/*app.use(cors({
  origin: function(origin, callback) {
    if (origin !== 'https://whattheword.xyz' || origin !== 'https://whattheword.xyz/blog') {
      callback(new Error('Not allowed by CORS'));
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));*/


app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/blog', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const allowedOrigins = ['https://whattheword.xyz'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
});


app.post('/textbox', async (req, res) => {
  const inputValue = req.body.inputValue;
  const modifiedText = await executeCode(inputValue);
  res.send({ modifiedText });
});

async function executeCode(inputValue) {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: process.env.API_KEY,
  });
  console.log("Analyzing for words described by: " + inputValue + "...");
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "Return some comma-separated single words (without using words in this prompt) in decreasing relevance that could be described by: " + inputValue,
    max_tokens: 256,
    temperature: 0.1,
  });
  console.log("Analysis complete. Results: " + response.data.choices[0].text);
  return response.data.choices[0].text;
}


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
