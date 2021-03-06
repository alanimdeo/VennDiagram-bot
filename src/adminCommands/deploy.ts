module.exports = {
    data: {
        name: "설치",
        command: "deploy",
    },
    async execute(message: any, commands: any) {
        const guildCommands: any[] = [];
        await commands.map((command: { data: any }) => guildCommands.push(command.data.toJSON()));
        await message.guild.commands.set(guildCommands);
        await message.reply(
            `Complete! Commands(${guildCommands.length}): ` +
                guildCommands
                    .map((command) => command.name)
                    .toString()
                    .replace(/,/g, ", ")
        );
    },
};
