let handler = async (m, { text, conn, command, usedPrefix }) => {

const fkontak2 = {'key': {'participants': '0@s.whatsapp.net', 'remoteJid': 'status@broadcast', 'fromMe': false, 'id': 'Halo'}, 'message': {'contactMessage': {'vcard': BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD}}, 'participant': '0@s.whatsapp.net'};

if (!text) return conn.sendMessage(m.chat, {text: `@${m.sender.split('@')[0]} أدخل السؤال أولا يا صديقي
مثال: ${usedPrefix + command} البوت يحبني
`.trim(), mentions: [m.sender] }, { quoted: fkontak2 });

let cap = `
╭──────≼NANO-BOT≽──────╮
┆ السائل: @${m.sender.split('@')[0]}
┆ السؤال: ${command} ${text}
┆ الاجابة: ${['نعم','ممكن','في الاغلب نعم','في الاغلب لا','لا','مستحيل'].getRandom()}
╰──────≼NANO-BOT≽──────╯
`.trim();

await conn.sendMessage(m.chat, {text: cap, mentions: [m.sender] }, { quoted: fkontak2 });
};
handler.help = ['pregunta <texto>?']
handler.tags = ['kerang']
handler.command = /^هل$/i
export default handler
