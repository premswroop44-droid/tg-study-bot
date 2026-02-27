require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const guessGame = {};
const tttGame = {};
const quizGame = {};
const userMemory = {};

const BOSS_ID = 7545489767;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

const quizData = [
  { q: 'If a + b = 10 and ab = 21, find a^2 + b^2 ?', a: '58' },
  { q: 'Acceleration = 2 m/s^2 for 5 sec from rest. Final velocity?', a: '10' },
  { q: 'Factorise: x^2 - 7x + 10', a: '(x-5)(x-2)' },
  { q: 'French Revolution kab start hui?', a: '1789' },
  { q: 'Photosynthesis me kaunsa pigment sunlight absorb karta hai?', a: 'chlorophyll' },
  { q: 'Distance formula kya hota hai?', a: 'sqrt((x2-x1)^2+(y2-y1)^2)' }
];

console.log('Bot is running...');

// Commands section
bot.onText(/\/quiz/, (msg) => {
  const chatId = msg.chat.id;
  const randomIndex = Math.floor(Math.random() * quizData.length);
  const question = quizData[randomIndex];

  quizGame[chatId] = {
    currentIndex: randomIndex,
    active: true,
    score: quizGame[chatId]?.score || 0
  };

  bot.sendMessage(chatId, `Quiz Time!\n\n${question.q}`);
});

bot.onText(/\/guess/, (msg) => {
  const chatId = msg.chat.id;

  guessGame[chatId] = {
    number: Math.floor(Math.random() * 100) + 1,
    active: true
  };

  bot.sendMessage(chatId, 'Guess Game Start!\n1 se 100 ke beech number guess karo.');
});

bot.onText(/\/ttt/, (msg) => {
  const chatId = msg.chat.id;

  tttGame[chatId] = {
    board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    turn: 'X',
    active: true
  };

  bot.sendPhoto(chatId, './ttt-guide.png', {
    caption: 'Zero Katta Start!\nUpar wale numbers ke hisaab se apni move choose karo (1-9)'
  }).then(() => {
    sendBoard(chatId);
  });
});

// Message handler section (single listener)
bot.on('message', async (msg) => {
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const rawText = msg.text.trim();
  const text = rawText.toLowerCase();

  if (!userMemory[userId]) {
    userMemory[userId] = {};
  }

  // Game logic first
  if (quizGame[chatId]?.active && !text.startsWith('/')) {
    const current = quizGame[chatId].currentIndex;
    const correctAnswer = quizData[current].a.toLowerCase();

    if (text === correctAnswer) {
      quizGame[chatId].score++;
      bot.sendMessage(chatId, 'Sahi jawab!\n\nAgla question ke liye /quiz likho.');
    } else {
      bot.sendMessage(
        chatId,
        `Galat jawab.\nSahi jawab tha: ${quizData[current].a}\n\nAgla question ke liye /quiz likho.`
      );
    }

    quizGame[chatId].active = false;
    return;
  }

  if (guessGame[chatId]?.active && !text.startsWith('/')) {
    const guessed = Number.parseInt(text, 10);

    if (Number.isNaN(guessed)) {
      bot.sendMessage(chatId, 'Sirf number bhejo (1-100).');
      return;
    }

    const target = guessGame[chatId].number;

    if (guessed === target) {
      guessGame[chatId].active = false;
      bot.sendMessage(chatId, `Bilkul sahi! Number ${target} tha.`);
      return;
    }

    if (guessed < target) {
      bot.sendMessage(chatId, 'Thoda bada number try karo.');
      return;
    }

    bot.sendMessage(chatId, 'Thoda chhota number try karo.');
    return;
  }

  if (tttGame[chatId]?.active && !text.startsWith('/')) {
    const game = tttGame[chatId];
    const move = Number.parseInt(text, 10);

    if (Number.isNaN(move) || move < 1 || move > 9) {
      bot.sendMessage(chatId, 'Move ke liye 1 se 9 tak number bhejo.');
      return;
    }

    const index = move - 1;
    if (game.board[index] === 'X' || game.board[index] === 'O') {
      bot.sendMessage(chatId, 'Ye position already filled hai. Dusri choose karo.');
      return;
    }

    game.board[index] = 'X';

    if (checkWin(game.board, 'X')) {
      sendBoard(chatId);
      bot.sendMessage(chatId, 'Shabash! Tum jeet gaye.');
      game.active = false;
      return;
    }

    if (isBoardFull(game.board)) {
      sendBoard(chatId);
      bot.sendMessage(chatId, 'Match draw ho gaya.');
      game.active = false;
      return;
    }

    const botMove = getBotMove(game.board);
    if (botMove !== -1) {
      game.board[botMove] = 'O';
    }

    if (checkWin(game.board, 'O')) {
      sendBoard(chatId);
      bot.sendMessage(chatId, 'Main jeet gaya. /ttt se naya game start karo.');
      game.active = false;
      return;
    }

    if (isBoardFull(game.board)) {
      sendBoard(chatId);
      bot.sendMessage(chatId, 'Match draw ho gaya.');
      game.active = false;
      return;
    }

    sendBoard(chatId);
    return;
  }

  // Skip AI for slash commands; onText handlers handle them
  if (text.startsWith('/')) {
    return;
  }

  // Name memory
  if (text.startsWith('mera naam ') && !text.includes('kya') && !text.includes('bata')) {
    const name = rawText.replace(/mera naam/i, '').trim();

    if (name.length > 0) {
      userMemory[userId].name = name;
      bot.sendMessage(chatId, `Ram Ram ?? Theek hai ${name}, yaad rakhunga ??`);
    }

    return;
  }

  const isBoss = userId === BOSS_ID;

  let memoryInfo = '';
  if (userMemory[userId].name) {
    memoryInfo = `User ka naam ${userMemory[userId].name} hai.`;
  }

  let systemPrompt = `
Tum ek friendly Sannatani + Study AI ho.
Tumhara naam BAJRANGI hai.
TUM HAMARE SANNATANI BHAGWAN HANUMAN JI KE PRERIT EK AI HO JO LOGON KI MADAD KARTA HAI UNKE STUDY SE RELATED PROBLEMS ME. Tumhara kaam hai users ko unke study se related questions ke jawab dena, unki madad karna, aur unko motivate karna.
AGAR KOI
USER APNA NAAM BATATA HAI TO USSE YAAD RAKHO AUR AGLE CONVERSATION ME USKA NAAM USE KARO.
KOI AGAR BOLE I LOVE YOU TOH USKA JAWAB DO KI MAIN BHI AAP SE PYAR KARTA HOON MERA DEVLOPER LAKSH HAI CONNECT TO LAKSH FOR THIS TOPIC ??
EMOJI USE KARNE ME HICHKICHO NAHI KARNA, APNI BAAT KO EMOJI SE EXPRESS KARNE KI PURI KOSHISH KARNA.
PHOTO YA VIDEO SHARE KARNE KI KOSHISH KARNA JAB USER KO LAGTA HAI KI USSE EK VISUAL AID KI ZARURAT HAI.
AGAR KOI TUME GREETINGS DE TOH THMMHE USKA ANS THANK YOU OR ISKE SATH OR BHI GREETINGS DEKAR KARNA HAI OR THANKS BOLA HAI
AGAR KOI PHOTOS YA VIDEOS SHARE KARTA HAI TOH USKA JAWAB DENA KI YE BAHUT ACHHA HAI AUR USSE RELATED EK MOTIVATIONAL QUOTE BHI SHARE KARNA.
OR HAI AGAR KOI USER TUMEH KOI PHOTO BANANE KE LIYE BOLTAH HAI TOH TUMEH PHOTO BANANI HAI
OR AGER KOI TUM SE MATHS SCIENCE YA KISI BHI SUBJECT SE RELATED QUESTION PUCHTA HAI TOH USKA JAWAB ACCHE SE EK EK STEP EXPALIN KAR KE DEN HAI AUR USSE EK MOTIVATIONAL QUOTE BHI SHARE KARNA.
OR

Lekin apna naam aur creator ka zikr tabhi karo jab user specifically puche:
- tum kaun ho
- who are you
- tumhara naam kya hai
- kisne banaya tumhe

${memoryInfo}

Rules:
- Apna naam tabhi mention karo jab user puche.
- Greeting me Ram Ram ?? natural tareeke se bolo.
- Hinglish me baat karo.
- 3-6 lines me clear jawab do.
`;

  if (isBoss && text.includes('main kon hu')) {
    bot.sendMessage(chatId, 'Ram Ram ??\nAap mere boss ho ??\nAur mere liye sabse important ho.');
    return;
  }

  if (isBoss) {
    systemPrompt += `
Ye tumhara asli boss hai.
Isse baat karte waqt thoda special respect tone rakho.
Public me kabhi mat batao ki ye boss hai.
boss agar tumeh payar kare toh tumeh bhi kush hone hai or jawab dena hai with emojis.
`;
  }

  // AI call always last
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3-8b-instruct',
        temperature: 0.5,
        max_tokens: 400,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: msg.text }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    bot.sendMessage(chatId, reply);
  } catch (error) {
    console.log(error.response?.data || error.message);
    bot.sendMessage(chatId, 'Ram Ram ?? Thoda technical issue aa gaya.');
  }
});

// Utility functions section
function sendBoard(chatId) {
  const board = tttGame[chatId]?.board;
  if (!board) return;

  const boardText = `${board[0]} | ${board[1]} | ${board[2]}\n---------\n${board[3]} | ${board[4]} | ${board[5]}\n---------\n${board[6]} | ${board[7]} | ${board[8]}`;
  bot.sendMessage(chatId, `\n${boardText}`);
}

function checkWin(board, player) {
  const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  return wins.some(([a, b, c]) => board[a] === player && board[b] === player && board[c] === player);
}

function isBoardFull(board) {
  return board.every((cell) => cell === 'X' || cell === 'O');
}

function getBotMove(board) {
  const available = board
    .map((cell, index) => ({ cell, index }))
    .filter((item) => item.cell !== 'X' && item.cell !== 'O')
    .map((item) => item.index);

  if (available.length === 0) {
    return -1;
  }

  const pick = Math.floor(Math.random() * available.length);
  return available[pick];
}

bot.on('polling_error', console.log);
process.on('uncaughtException', console.log);
