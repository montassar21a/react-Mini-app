const { Telegraf } = require("telegraf");
const TOKEN = "7505537490:AAECPjfGK0rr1k49sagQa2hCH9lFq1BTyuM";
const bot = new Telegraf(TOKEN);

const web_link = "flower-inu.netlify.app";

bot.start((ctx) =>
  ctx.reply("Welcome To My-Mini-App ;)", {
    reply_markup: {
      keyboard: [[{ text: "web app", web_app: { url: web_link } }]],
    },
  })
);

bot.launch();
