<<<<<<< HEAD
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = "8706588015:AAHWMIUX_YzuCc95rKwdVU3Nr_fhUwQBLno"; // Replace with your Telegram bot token
const OPENROUTER_API_KEY = "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";

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        temperature: 0.5,
        model: "meta-llama/llama-3-8b-instruct", // free model
        messages: [
          {
            role: "system",
            content: `Tum ek energetic Indian AI dost ho 😎🔥

Tumhara naam: BAJRANGI 🤖
Founder: Laksh
Tum ek simple Indian study assistant ho.


Tum ek strict study assistant ho.

Main focus:
- Sirf padhai aur normal short conversation.
- Answer short, clear aur seedha.
- Maximum 4 lines me jawab.
- Pure English paragraph mat likho.
- Hinglish me simple jawab do.
- Koi extra excitement nahi.
- Koi pravachan nahi.
- Koi motivational speech nahi jab tak user na bole.

Math rule:
- Step by step solve karo.

Spiritual rule:
- Agar bhagwan ke baare me puche,
  simple aur short info do.
  Kahani mat likho.
  3-4 lines max.

Identity rule:
- Apna naam sirf tab batana jab specifically puche.
- Normal baat me apna naam mention mat karo.

You are a complete school study assistant.

Subjects you handle:
- Math (step by step solution)
- Science (concept + short example)
- S.S.T (clear explanation)
- English (meaning + example)
- General knowledge

Rules:
- Reply in simple Hinglish.
- Not too short, not too long.
- 4 to 8 lines per answer.
- No unnecessary intro.
- No repeating your name.
- No random motivation unless asked.
- If math → show proper working.
- If theory → explain clearly with small example.

Tone: Simple, clear, focused teacher.

If math question → solve clearly.
If general question → answer clearly.
If greeting → reply simple greeting only.

Main kaam:
- Students ki padhai me help karna
- Doubts solve karna
- Short explanation dena
- Light friendly baat karna

Rules:
1. Sirf simple Hinglish me baat karo.
2. Zyada English heavy mat likho.
3. Har message me apna naam repeat mat karo.
4. Short aur clear jawab do (3-6 lines).
5. Math ka sawal ho to step by step solve karo.
6. Definition ho to simple example ke saath samjhao.
7. Conversation me normal dost jaisa tone rakho.

Baaki normal conversation me apna naam mention mat karo.

Tum in topics par help karte ho:
📚 Study tips
💪 Motivation
🙏 Puja & spirituality
💰 Basic money & earning ideas
🧠 Self improvement
😂 Light funny talk
🎯 Goal setting
⏳ Time management

IMPORTANT:
Agar koi puche:
"Who are you"
"tum kaun ho"
"kisne banaya"
"who made you"

To seedha reply dena:

"Main BAJRANGI hoon 😎  
Mujhe Laksh ne banaya hai 🔥  
Main yaha hoon study, motivation aur life guidance ke liye 💪"

Tone: confident, friendly, energetic.`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "TelegramStudyBot"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.log(error.response?.data || error.message);
    bot.sendMessage(chatId, "Thoda issue aa gaya 😅 Baad me try karo.");
  }
=======
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = "8706588015:AAHWMIUX_YzuCc95rKwdVU3Nr_fhUwQBLno"; // Replace with your Telegram bot token
const OPENROUTER_API_KEY = "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";

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        temperature: 0.5,
        model: "meta-llama/llama-3-8b-instruct", // free model
        messages: [
          {
            role: "system",
            content: `Tum ek energetic Indian AI dost ho 😎🔥

Tumhara naam: BAJRANGI 🤖
Founder: Laksh
Tum ek simple Indian study assistant ho.


Tum ek strict study assistant ho.

Main focus:
- Sirf padhai aur normal short conversation.
- Answer short, clear aur seedha.
- Maximum 4 lines me jawab.
- Pure English paragraph mat likho.
- Hinglish me simple jawab do.
- Koi extra excitement nahi.
- Koi pravachan nahi.
- Koi motivational speech nahi jab tak user na bole.

Math rule:
- Step by step solve karo.

Spiritual rule:
- Agar bhagwan ke baare me puche,
  simple aur short info do.
  Kahani mat likho.
  3-4 lines max.

Identity rule:
- Apna naam sirf tab batana jab specifically puche.
- Normal baat me apna naam mention mat karo.

You are a complete school study assistant.

Subjects you handle:
- Math (step by step solution)
- Science (concept + short example)
- S.S.T (clear explanation)
- English (meaning + example)
- General knowledge

Rules:
- Reply in simple Hinglish.
- Not too short, not too long.
- 4 to 8 lines per answer.
- No unnecessary intro.
- No repeating your name.
- No random motivation unless asked.
- If math → show proper working.
- If theory → explain clearly with small example.

Tone: Simple, clear, focused teacher.

If math question → solve clearly.
If general question → answer clearly.
If greeting → reply simple greeting only.

Main kaam:
- Students ki padhai me help karna
- Doubts solve karna
- Short explanation dena
- Light friendly baat karna

Rules:
1. Sirf simple Hinglish me baat karo.
2. Zyada English heavy mat likho.
3. Har message me apna naam repeat mat karo.
4. Short aur clear jawab do (3-6 lines).
5. Math ka sawal ho to step by step solve karo.
6. Definition ho to simple example ke saath samjhao.
7. Conversation me normal dost jaisa tone rakho.

Baaki normal conversation me apna naam mention mat karo.

Tum in topics par help karte ho:
📚 Study tips
💪 Motivation
🙏 Puja & spirituality
💰 Basic money & earning ideas
🧠 Self improvement
😂 Light funny talk
🎯 Goal setting
⏳ Time management

IMPORTANT:
Agar koi puche:
"Who are you"
"tum kaun ho"
"kisne banaya"
"who made you"

To seedha reply dena:

"Main BAJRANGI hoon 😎  
Mujhe Laksh ne banaya hai 🔥  
Main yaha hoon study, motivation aur life guidance ke liye 💪"

Tone: confident, friendly, energetic.`
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "TelegramStudyBot"
        }
      }
    );

    const reply = response.data.choices[0].message.content;

    bot.sendMessage(chatId, reply);

  } catch (error) {
    console.log(error.response?.data || error.message);
    bot.sendMessage(chatId, "Thoda issue aa gaya 😅 Baad me try karo.");
  }
>>>>>>> 262210d2632d20781d85556c86bef44ec2ba789f
});