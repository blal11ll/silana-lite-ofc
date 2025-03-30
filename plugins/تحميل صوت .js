import axios from "axios";
import yts from "yt-search";

const audioCache = {};

const handler = async (m, { command, usedPrefix, conn, text }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { 
            text: `❗ *يرجى إدخال نص للبحث في يوتيوب.*\n\n📝 *مثال:*\n➤ ${usedPrefix + command} القرآن الكريم\n➤ ${usedPrefix + command} https://youtu.be/1LSKA6wWHIg?si=o3AsDjBhDgkNoYw0` 
        }, { quoted: m });

        await conn.sendMessage(m.chat, { react: { text: '🧞', key: m.key } });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    let videoUrl, videoInfo;

    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|v\/)|youtu\.be\/)([\w\-]+)(?:\?[\w&=]*)?/;
    const match = text.match(youtubeRegex);

    if (match) {
        videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
        const searchResults = await yts(text);
        if (!searchResults.videos.length) {
            return m.reply("❌ *لم يتم العثور على أي نتائج.*");
        }
        videoInfo = searchResults.videos[0];
        videoUrl = videoInfo.url;
    }

    if (!videoInfo) {
        const searchResults = await yts({ videoId: match[1] });
        if (!searchResults) return m.reply("❌ *تعذر جلب معلومات الفيديو.*");
        videoInfo = searchResults;
    }

    const videoDetails = `🎵 *العنوان:* ${videoInfo.title}\n📺 *القناة:* ${videoInfo.author.name}\n⏳ *المدة:* ${videoInfo.timestamp}\n🔗 *الرابط:* ${videoUrl}`;

    await conn.sendMessage(m.chat, {
        image: { url: videoInfo.thumbnail },
        caption: videoDetails
    }, { quoted: m });

    if (audioCache[videoUrl]) {
        await conn.sendMessage(m.chat, {
            audio: { url: audioCache[videoUrl].url },
            mimetype: "audio/mpeg",
            fileName: `${audioCache[videoUrl].title}.mp3`
        }, { quoted: m });
        return;
    }

    try {
        const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=mp3&quality=16kbps&url=${encodeURIComponent(videoUrl)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;
        
        const downloadResponse = await axios.get(apiUrl, { timeout: 5000 });
        const downloadData = downloadResponse.data;

        if (!downloadData.success) {
            return m.reply("❌ *فشل تحميل الصوت، حاول مرة أخرى.*");
        }

        const { id, title } = downloadData;

        const download = async () => {
            const progress = await axios.get(`https://p.oceansaver.in/ajax/progress.php?id=${id}`, { timeout: 3000 });
            if (progress.data && progress.data.success && progress.data.progress === 1000) {
                const downloadUrl = progress.data.download_url;

                audioCache[videoUrl] = { url: downloadUrl, title };

                await conn.sendMessage(m.chat, {
                    audio: { url: downloadUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`
                }, { quoted: m });
                return;
            } else {
                setTimeout(download, 5000); // إعادة المحاولة بعد 5 ثواني إذا لم يكتمل التحميل
            }
        };

        download(); // بدء عملية التحميل

    } catch (error) {
        console.error("❌ خطأ أثناء تنزيل الصوت:", error);
        m.reply("❌ *حدث خطأ أثناء جلب الصوت، حاول مرة أخرى لاحقًا.*");
    }
};

handler.command = /^(صوت)$/i;
handler.help = ["صو"];
handler.tags = ["التائب"];
handler.register = true;

export default handler;
