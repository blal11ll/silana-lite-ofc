import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { command, usedPrefix, conn, args, text }) => {

    if (!text) {
      await conn.sendMessage(m.chat, { text: `*❲ ❗ ❳ يرجي إدخال نص للبحث في يوتيوب .*\nمثال :\n> ➤  ${usedPrefix + command} القرآن الكريم\n> ➤  ${usedPrefix + command} https://youtu.be/JLWRZ8eWyZo?si=EmeS9fJvS_OkDk7p` }, { quoted: m });
      await conn.sendMessage(m.chat, { react: { text: '❗', key: m.key } });
      return;
    }
    
    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    
    try {
      const yt_play = await search(text);
      const dataMessage = `*❲ نتيجة البحث عن : ${text} ❳*\n\n➤ العنوان : ${yt_play[0].title}\n➤ النشر : ${yt_play[0].ago}\n➤ الطول : ${secondString(yt_play[0].duration.seconds)}\n➤ الرابط : ${yt_play[0].url}\n➤ المشاهدات : ${MilesNumber(yt_play[0].views)}\n➤ الصانع : ${yt_play[0].author.name}\n➤ القناة : ${yt_play[0].author.url}`.trim();

      const iturl = yt_play[0].url;
      const itimg = yt_play[0].thumbnail;
      const messa = await prepareWAMessageMedia({ image: { url: itimg } }, { upload: conn.waUploadToServer });

      let msg = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: dataMessage },
              footer: { text: `© ${global.wm}`.trim() },
              header: {
                hasMediaAttachment: true,
                imageMessage: messa.imageMessage,
              },
              nativeFlowMessage: {
                buttons: [
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '〘 🎧 صــوتي 〙', id: `${usedPrefix}صوت ${iturl}` }) },
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '〘 🎥 فيــديو 〙', id: `${usedPrefix} فيديو ${iturl}` }) },
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '〘  معطل🎤 فــويس 〙', id: `${usedPrefix}فويس ${iturl}` }) },
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '〘معطل 📹 جيــف 〙', id: `${usedPrefix}جيف ${iturl}` }) },
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '〘معطل 📻 ملــف صــوتي 〙', id: `${usedPrefix}صو ${iturl}` }) },
                  { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '〘 معطل📺 ملــف فيــديو 〙', id: `${usedPrefix}فيد ${iturl}` }) }
                ],
                messageParamsJson: "",
              },
            },
          },
        },
      }, { userJid: conn.user.jid, quoted: m });

      await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
      
      await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id });

    } catch {
      await conn.sendMessage(m.chat, { text: `*❲ ❗ ❳ حدث خطأ عند البحث في يوتيوب .*\nيرجي ادخال نص صحيح أو رابط مثال :\n> ➤  ${usedPrefix + command} القرآن الكريم\n> ➤  ${usedPrefix + command} https://youtu.be/JLWRZ8eWyZo?si=EmeS9fJvS_OkDk7p` }, { quoted: m });
      await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }

};

handler.command = /^(شغل)$/i;
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: 'ar', gl: 'AR', ...options });
  return search.videos;
}

function MilesNumber(number) {
  const exp = /(\d)(?=(\d{3})+(?!\d))/g;
  const rep = '$1.';
  const arr = number.toString().split('.');
  arr[0] = arr[0].replace(exp, rep);
  return arr[1] ? arr.join('.') : arr[0];
}

function secondString(seconds) {
  seconds = Number(seconds);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const dDisplay = d > 0 ? d + (d == 1 ? ' día, ' : ' días, ') : '';
  const hDisplay = h > 0 ? h + (h == 1 ? ' hora, ' : ' horas, ') : '';
  const mDisplay = m > 0 ? m + (m == 1 ? ' minuto, ' : ' minutos, ') : '';
  const sDisplay = s > 0 ? s + (s == 1 ? ' segundo' : ' segundos') : '';
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return 'n/a';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return i === 0 ? `${bytes} ${sizes[i]}` : `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}
