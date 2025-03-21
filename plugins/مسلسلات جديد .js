import yts from 'yt-search';
import { prepareWAMessageMedia, generateWAMessageFromContent } from '@whiskeysockets/baileys';

const handler = async (m, { command, usedPrefix, conn, text }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { text: `❗ *خويا، خاصك تكتب شنو باغي تقلب عليه فـ يوتيوب.*\n\n📝 *مثال:* \n➤ ${usedPrefix + command} القرآن الكريم\n➤ ${usedPrefix + command} https://youtu.be/example` }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '⚠️', key: m.key } });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const yt_play = await yts.search(text);
        const video = yt_play.videos[0];

        const dataMessage = 
`📌 *ها شنو لقيت ليك على:* 『 ${text} 』
━━━━━━━━━━━━━━━━
🎬 *العنوان:* ${video.title}
📅 *تاريخ النشر:* ${video.ago}
⏱️ *المدة:* ${secondString(video.duration.seconds)}
👁️‍🗨️ *المشاهدات:* ${MilesNumber(video.views)}
📺 *القناة:* ${video.author.name}
🔗 *الرابط:* ${video.url}
━━━━━━━━━━━━━━━━
📥 *اختار شنو بغيت تحمل:*`;

        const thumbnail = await prepareWAMessageMedia({ image: { url: video.thumbnail } }, { upload: conn.waUploadToServer });

        let msg = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        body: { text: dataMessage },
                        footer: { text: `© ${global.wm}`.trim() },
                        header: {
                            hasMediaAttachment: true,
                            imageMessage: thumbnail.imageMessage,
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🔊 تحميل الصوت 🎵', id: `${usedPrefix}تحميل_صوت ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📹 تحميل الفيديو 🎬', id: `${usedPrefix}تحميل_فيديو ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🎧 صوت 128kbps', id: `${usedPrefix}تحميل_صوت_128 ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '🎧 صوت 320kbps', id: `${usedPrefix}تحميل_صوت_320 ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📺 فيديو 360p', id: `${usedPrefix}تحميل_فيديو_360 ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📺 فيديو 720p', id: `${usedPrefix}تحميل_فيديو_720 ${video.url}` }) },
                                { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: '📺 فيديو 1080p', id: `${usedPrefix}تحميل_فيديو_1080 ${video.url}` }) }
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
        await conn.sendMessage(m.chat, { text: `❌ *وخّا، كاين شي خطأ فـ البحث.*\n\n🔍 *حاول تقلب مزيان ولا دير رابط صحيح.*` }, { quoted: m });
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
};

handler.command = /^(شغل)$/i;
export default handler;

function MilesNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function secondString(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + " ساعة " : ""}${m > 0 ? m + " دقيقة " : ""}${s > 0 ? s + " ثانية" : ""}`.trim();
}
