import fetch from 'node-fetch'
import yts from 'yt-search'
import axios from 'axios'
import crypto from 'crypto'

let handler = async (m, { conn, text, args }) => {
    if (!text) return conn.reply(m.chat, "𓆩❀𓆪 أدخل اسم ما تريد البحث عنه", m)

    m.react('⏳')

    try {
        let res = await yts(args.join(" "))
        if (!res.videos.length) return conn.reply(m.chat, "⚠️ لم يتم العثور على نتائج!", m)

        let vid = res.videos[0]
        let vidUrl = `https://youtu.be/${vid.videoId}`

        let cookies = [
            `NEXT_LOCALE=en`,
            `bucket=${crypto.randomBytes(16).toString('hex')}`,
            `country=EG`
        ].join('; ')

        let { data } = await axios.post(
            'https://www.clipto.com/api/youtube',
            { url: vidUrl },
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 9)',
                    'Cookie': cookies
                }
            }
        )

        if (!data.success) {
            return conn.sendMessage(m.chat, { text: "❌ فشل التحميل، حاول مرة أخرى!" }, { quoted: m })
        }

        let choices = []
        let counter = 1
        let mediaMap = {}

        let sortedMedias = data.medias
            .filter(m => !m.is_audio)
            .sort((a, b) => parseInt(a.quality) - parseInt(b.quality))

        for (let media of sortedMedias) {
            let optionText = `${counter}. 🎥 فيديو - ${media.quality}p`
            choices.push(optionText)
            mediaMap[counter] = media
            counter++
        }

        let audio = data.medias.find(m => m.is_audio)
        if (audio) {
            choices.push(`${counter}. 🎵 صوت فقط`)
            mediaMap[counter] = audio
        }

        let txt = `╭──────⭑────────╮  
         𓆩⟡ تحميل من يوتيوب ⟡𓆪
╰────────⭑──────╯
⤷ 🏷️ العنوان: ${vid.title}
⤷ ⏳ المدة: ${vid.timestamp}
⤷ 👀 عدد المشاهدات: ${vid.views}
⤷ 📆 تم الرفع منذ: ${vid.ago}

🎬 *اختر الجودة المطلوبة:*
${choices.join("\n")}

📌 *أجب برقم الجودة المطلوبة للتحميل:*`

        let SM = await conn.sendFile(m.chat, vid.thumbnail, 'تحميل_يوتيوب.jpg', txt, m)
        m.react('✅')

        conn.ev.on("messages.upsert", async (upsertedMessage) => {
            let RM = upsertedMessage.messages[0]
            if (!RM.message) return

            let UR = RM.message.conversation || RM.message.extendedTextMessage?.text
            let UC = RM.key.remoteJid

            if (RM.message.extendedTextMessage?.contextInfo?.stanzaId === SM.key.id) {
                let selectedIndex = parseInt(UR)

                if (!mediaMap[selectedIndex]) {
                    return conn.sendMessage(UC, { text: "⚠️ خيار غير صالح، يرجى الرد برقم صحيح من القائمة." }, { quoted: RM })
                }

                let selectedMedia = mediaMap[selectedIndex]
                let caption = selectedMedia.is_audio ? "✔️ تم تحميل الصوت بنجاح!" : `✔️ تم تحميل الفيديو بجودة ${selectedMedia.quality}p بنجاح!`
                let fileType = selectedMedia.is_audio ? "audio/mpeg" : "video/mp4"
                let sendMedia = selectedMedia.is_audio
                    ? { audio: { url: selectedMedia.url }, mimetype: fileType, caption }
                    : { video: { url: selectedMedia.url }, mimetype: fileType, caption }

                await conn.sendMessage(UC, sendMedia, { quoted: RM })
            }
        })

    } catch (error) {
        console.error(error)
        conn.sendMessage(m.chat, { text: "❌ حدث خطأ أثناء المعالجة!" }, { quoted: m })
    }
}

handler.command = ["يوتيوب"]

export default handler
