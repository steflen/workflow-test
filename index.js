require("dotenv").config();
const Telegraf = require("telegraf");

const { encode } = require("base-64");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply("Type /help to get a list of available commands"));
bot.help(ctx => ctx.reply("Only 'do-something' supported"));
bot.on("sticker", ctx => ctx.reply("👍"));

bot.on("text", ctx => {
  if (ctx.message.text === "do-something") {
    triggerAction(ctx.message.text)
      .then(response => {
        console.dir(response);
        ctx.reply("Check your repo");
      })
      .catch(err => {
        console.dir(err);
        ctx.reply("Something went wrong");
      });
  } else {
    console.dir(ctx.message);
    ctx.reply("Unknown command");
  }
});

bot.launch();

const triggerAction = event => {
  return axios.post(
    `https://api.github.com/repos/${process.env.GH_USER}/${process.env.GH_REPO}/dispatches`,
    {
      event_type: event,
      client_payload: {
        runtest: "here could be another dynamic value"
      }
    },
    {
      headers: {
        // that custom media type from github will change in future, see docs
        Accept: "application/vnd.github.everest-preview+json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encode(
          `${process.env.GH_USER}:${process.env.GH_TOKEN}`
        )}`
      }
    }
  );
};
