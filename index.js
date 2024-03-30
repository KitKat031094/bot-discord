const Discord = require('discord.js');
const ytdl = require('ytdl-core');

const client = new Discord.Client({
    intents: 641
});

client.on('ready', () => {
    console.log('Bot encendido.');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!play')) return;

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('¡Debes estar en un canal de voz para reproducir música!');

    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        return message.reply('¡No tengo permisos para unirme o hablar en ese canal de voz!');
    }

    const args = message.content.slice(6).trim().split(/ +/);
    const url = args[0];
    if (!url) return message.reply('Por favor, proporciona un enlace válido de YouTube.');

    try {
        const connection = await voiceChannel.join();
        const stream = ytdl(url, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('start', () => {
            message.channel.send('Reproduciendo la canción desde YouTube.');
        });

        dispatcher.on('finish', () => {
            voiceChannel.leave();
        });

        dispatcher.on('error', console.error);
    } catch (error) {
        console.error(error);
        message.reply('Hubo un error al reproducir la música desde el enlace de YouTube.');
    }
});
// Inicia sesión en Discord con tu token
client.login('MTIyMzQyODE5NjYzNzIxMjY3Mg.GvY4GX.1nQ5UzPxJ8GrR9jCS1521pLGIC-pL9rdqEN8O8');