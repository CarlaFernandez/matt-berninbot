var discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var lyrics = fs.readFileSync('./lyrics.txt').toString().split("\n");

// Initialize Discord Bot
var bot = new discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);

        switch(cmd) {
            case 'song':
                sendSong(channelID, user);
                break;
         }
     }
});

function sendSong(channelID, user) {
    logger.info('Received song command from ' + user);
    var msg = buildMessage();
    bot.sendMessage({
        to: channelID,
        message: msg
    });
}

function buildMessage() {
    msg = ""
    for (i = 0; i < 4; i++) {
        msg += getRandomLine() + "\n";
    }

    return msg;
}

function getRandomLine() {
    min = 0;
    max = Math.floor(lyrics.length - 1);
    do {
        random = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (!lyrics[random].trim());

    return lyrics[random];
}