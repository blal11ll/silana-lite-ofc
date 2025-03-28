import { prepareWAMessageMedia, generateWAMessageFromContent, getDevice } from '@whiskeysockets/baileys'
import yts from 'yt-search';
import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    
    const device = await getDevice(m.key.id);
    
    let faketext = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    remoteJid: m.sender
  },
  message: {
    conversation: '⋄┄┄〘 بحــث اليــوتيوب 〙┄┄⋄'
  },
  participant: '0@s.whatsapp.net',
};
    
    const infotext = `*❲ ❗ ❳ يرجي إدخال نص للبحث في اليوتيوب .*\nمثال :\n> ➤  ${usedPrefix + command} القرآن الكريم\n> ➤  ${usedPrefix + command} https://youtu.be/JLWRZ8eWyZo?si=EmeS9fJvS_OkDk7p`
    
    
  if (!text) return conn.sendMessage(m.chat, {text: infotext, mentions: [m.sender]}, { quoted: faketext });
    
  if (device !== 'desktop' || device !== 'web') {      
  await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });
    
  
  const results = await yts(text);
  const videos = results.videos.slice(0, 30);
  const randomIndex = Math.floor(Math.random() * videos.length);
  const randomVideo = videos[randomIndex];

  var messa = await prepareWAMessageMedia({ image: {url: randomVideo.thumbnail}}, { upload: conn.waUploadToServer });
  
  const imagurl = 'https://files.catbox.moe/hm0l6b.jpg';
 
 let chname = '⛊  𝚂𝙰𝚈𝙴𝙳-𝚂𝙷𝙰𝚆𝙰𝚉𝙰';
 let chid = '120363316635505389@newsletter';
  
  const captain = `
  
  *⎙ نتائج البحث :* ${results.videos.length}
  
  *⊳ العنوان :* ${randomVideo.title}
  *⊳ الصانع :* ${randomVideo.author.name}
  *⊳ المشاهدات :* ${randomVideo.views}
  *⊳ الرابط :* ${randomVideo.url}
  *⊳ البوستر :* ${randomVideo.thumbnail}
  
  
> 💡 اختر من القائمه بالاسفل.
  `;
  
  const interactiveMessage = {
    body: { text: captain },
    footer: { text: `${global.wm}`.trim() },  
      header: {
          title: `*⋄┄┄┄┄┄┄┄〘 بحــث اليــوتيوب 〙┄┄┄┄┄┄┄⋄*\n`,
          hasMediaAttachment: true,
          imageMessage: messa.imageMessage,
      },
      contextInfo: {
        mentionedJid: await conn.parseMention(captain), 
        isForwarded: true, 
        forwardingScore: 1, 
        forwardedNewsletterMessageInfo: {
        newsletterJid: chid, 
        newsletterName: chname, 
        serverMessageId: 100
        },
        externalAdReply: {
        showAdAttribution: true,
          title: "⋄┄〘 بحــث اليــوتيوب 〙┄⋄",
          body: "❲ قسم البحث ❳",
          thumbnailUrl: imagurl,
          mediaUrl: imagurl,
          mediaType: 1,
          sourceUrl: 'https://www.atom.bio/shawaza-2000/',
          renderLargerThumbnail: false
        }
      },
    nativeFlowMessage: {
      buttons: [
        {
          name: 'single_select',
          buttonParamsJson: JSON.stringify({
            title: '⋄┄┄┄┄┄〘 قائمة النتائج 〙┄┄┄┄┄⋄',
            sections: videos.map((video) => ({
              title: video.title,
              rows: [
                {
                  header: '',
                  title: '',
                  description: '〘 🎧 صــوتي 〙',
                  id: `.اغنيه ${video.url}`
                },
                  {
                  header: '',
                  title: '',
                  description: '〘 🎥 فيــديو 〙',
                  id: `.فيديو ${video.url}`
                },
                
              ]
            }))
          })
        }
      ],
      messageParamsJson: ''
    }
  };        
            
        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage,
                },
            },
        }, { userJid: conn.user.jid, quoted: faketext })
        
        await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
      conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id});

  } else {
  
  const results = await yts(text);
  const tes = results.all;
  
  const teks = results.all.map((v) => {
    switch (v.type) {
      case 'video': return `
° *العنوان:* ${v.title}
↳ 🫐 *الرابط:* ${v.url}
↳ 🕒 *المدة:* ${v.timestamp}
↳ 📥 *منذ:* ${v.ago}
↳ 👁 *المشاهدات:* ${v.views}`;
    }
  }).filter((v) => v).join('\n\n◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦◦\n\n');
  
  conn.sendFile(m.chat, tes[0].thumbnail, 'error.jpg', teks.trim(), faketext);      
  }    
};
handler.help = ['يوتيوب <النص>'];
handler.tags = ['البحث'];
handler.command = ['يوتيوب'];

export default handler;


/*
╮────────────────────────╭ـ
│ By : 𝗦𝗔𝗬𝗘𝗗-𝗦𝗛𝗔𝗪𝗔𝗭𝗔 🧞
│ Number : https://wa.me/201145624848
│ Community : https://chat.whatsapp.com/Hg4F5jQ9Z9r1lUH6I1jkhI
│ Group Support : https://chat.whatsapp.com/JGtNRFwfHJC8XholdKmVGS
│ Chanel : https://whatsapp.com/channel/0029Vael6wMJP20ze3IXJk0z
╯────────────────────────╰ـ 
*/
