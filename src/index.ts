console.log("모듈 로딩 중..");
const fs = require("fs");
const Discord = require("discord.js");
const { Player } = require("discord-music-player");
const config = require("./config.json");
console.log("모듈 로딩 완료!");

const client = new Discord.Client({
    intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES],
});
client.player = new Player(client, {
    leaveOnEmpty: true,
    leaveOnEnd: false,
});

client.commands = new Discord.Collection();
client.adminCommands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands").filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(`명령어 불러오는 중.. (${command.data.name})`);
    client.commands.set(command.data.name, command);
}

const adminCommandFiles = fs.readdirSync("./adminCommands").filter((file: string) => file.endsWith(".js") || file.endsWith(".ts"));

for (const file of adminCommandFiles) {
    const command = require(`./adminCommands/${file}`);
    console.log(`관리자 명령어 불러오는 중.. (${command.data.name})`);
    client.adminCommands.set(command.data.command, command);
}

client.once("ready", () => {
    console.log(`로그인 완료! 토큰: \x1b[32m${config.token}\x1b[0m\n준비 완료!`);
});

client.on("interactionCreate", async (interaction: typeof Discord.Interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    await command.execute(interaction);
});

client.on("messageCreate", async (message: typeof Discord.Message) => {
    if (message.author.bot) return;

    if (!message.content.toLowerCase().startsWith(config.adminPrefix + "admin") || !config.adminIDs.includes(message.author.id)) return;

    const command = client.adminCommands.get(message.content.split(" ")[1]);

    if (!command) return;

    await command.execute(message, client.commands);
});

client.player.on("error", (queue: any, err: Error) => {
    console.error(err);
});

console.log("Discord 서버에 로그인 중..");
client.login(config.token);
