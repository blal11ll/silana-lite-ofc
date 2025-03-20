import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("تحويل نص ل  تعليق جذاب مثال : \n\n *.elevenlab* hello how are you silana bot")
  conn.sendMessage(m.chat, {
    audio: { url: `https://api.yanzbotz.my.id/api/tts/tts-anime?query=&character=&lang=&speed=&apiKey=?text=${encodeURIComponent(text)}&key=Bell409&voice=prabowo` }, 
    mimetype: "audio/mpeg", 
    ptt: true 
  }, { quoted: m })
}

handler.command = ['elevenlab', 'aibowo']
handler.help = ['elevenlab', 'aibowo']
handler.tags = ['ai']
export default handler
