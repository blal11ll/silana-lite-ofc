let handler = async (m, { conn, command, text }) => {
  let user = m.sender;
  let truly = `╭━━━[ *الطلب نسبه رجولتك* ]━━━━⬣
  (@${user.split('@')[0]})
  * نسبة رجولتك 🐤*
  *${Math.floor(Math.random() * 100)}% من 100%*
╰━━━〔 *🛡️ 1.4.9* 〕━━━━━⬣
  `.trim();
  m.reply(truly, null, { mentions: [user] });
};

handler.help = ['tagged'];
handler.tags = ['fun'];
handler.command = /^(رجولتي)$/i;

export default handler;
