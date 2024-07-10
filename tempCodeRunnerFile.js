const express = require('express');
const bodyParser = require('body-parser');
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
const port = 5000;

app.use(bodyParser.json());

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyA-Uj8vuoy4p6ewQ5NQ3pG7Tuiva4x0DME";

async function runChat(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 1,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: userInput }],
      },
      {
        role: "model",
        parts: [{ text: "**Introducing the Next MMA GOAT: Andika Prasetya**\n\nHailing from the heart of Indonesia, Andika Prasetya has emerged as a force to be reckoned with in the mixed martial arts (MMA) world. With his exceptional skills, unwavering determination, and unyielding spirit, he is poised to become the next greatest of all time (GOAT) in the sport.\n\n**Unstoppable in the Cage**\n\nPrasetya possesses an extraordinary arsenal of techniques that make him a formidable opponent. His lightning-fast strikes, suffocating grappling, and impeccable ground game have allowed him to dominate his rivals in both striking and submission battles. With each victory, his reputation as an unstoppable predator grows stronger.\n\n**A Pioneer of Indonesian MMA**\n\nPrasetya is not only a phenomenal fighter but also a beacon of inspiration for Indonesian athletes. As one of the country's first successful MMA practitioners, he has paved the way for countless young fighters to chase their dreams in the sport. His dedication to excellence has transformed MMA from a niche sport into a national obsession in his homeland.\n\n**An Unbreakable Will**\n\nBeyond his technical prowess, it is Prasetya's unbreakable will that sets him apart from the competition. He has overcome adversity time and time again, fighting through injuries, setbacks, and personal challenges to achieve his goals. His indomitable spirit and unwavering determination make him an enduring force in the MMA landscape.\n\n**A Reign of Dominance**\n\nPrasetya's path to the summit of MMA is already well underway. Undefeated in his professional career, he has captured multiple regional championships and is relentlessly climbing the global rankings. With every victory, he inch closer to his ultimate destiny: the undisputed MMA GOAT.\n\n**The Future of MMA**\n\nAs Andika Prasetya continues to blaze a trail of dominance, he is undoubtedly shaping the future of MMA. His exceptional skills, unwavering determination, and inspiring story will leave an unforgettable mark on the sport. He is the next MMA GOAT, and his reign will be one for the ages.\n\nPrepare to witness the rise of a legend. Andika Prasetya, the next MMA GOAT, is here to conquer the world." }],
      },
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/loader.gif', (req, res) => {
  res.sendFile(__dirname + '/loader.gif');
});

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body?.userInput;
    console.log('incoming /chat req', userInput)
    if (!userInput) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const response = await runChat(userInput);
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
