import fetch from 'node-fetch';

const voices = {
    'اريا': 'Aria',
    'روجير': 'Roger',
    'سارة': 'Sarah',
    'لارا': 'Laura',
    'تشارلي': 'Charlie',
    'جورج': 'George',
    'كالم': 'Callum',
    'ريفر': 'River',
    'ليام': 'Liam',
    'شارلوت': 'Charlotte',
    'أليس': 'Alice',
    'ماتيلدا': 'Matilda',
    'ويل': 'Will',
    'جيسيكا': 'Jessica',
    'إيريك': 'Eric',
    'كريس': 'Chris',
    'براين': 'Brian',
    'دانيال': 'Daniel',
    'ليلي': 'Lily',
    'بيل': 'Bill'
};

let handler = async (m, { conn, text, command }) => {
    if (['قائمة_الأصوات', 'voices', 'الاصوات'].includes(command)) {
        let voiceList = '*🎧 قائمة الأصوات المتاحة:*\n\n';
        voiceList += Object.keys(voices).map(v => `- *${v}*`).join('\n');
        voiceList += '\n\n*\`『 استخدم الأمر مع النص لتحويله إلى صوت 』\`*';
        return m.reply(voiceList);
    }

    if (!text) return m.reply('*\`『 اكتب النص الذي تريد تحويله إلى صوت بعد الأمر 🍬 』\`*');

    const voiceName = voices[command];
    if (!voiceName) return m.reply('الصوت غير موجود، جرب أحد الأصوات التالية:\n' + Object.keys(voices).join(', '));

    try {
        let res = await fetch(`https://the-end-api.vercel.app/home/sections/VoiceAi/api/api/voice/${voiceName}?q=${encodeURIComponent(text)}`);
        let data = await res.json();

        if (!data.voice_link) return m.reply('حدث خطأ في جلب الصوت، يرجى المحاولة مرة أخرى.');

        await conn.sendMessage(m.chat, {
            audio: { url: data.voice_link },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });

    } catch (error) {
        m.reply(`حدث خطأ: ${error.message}`);
    }
};

Object.keys(voices).forEach(cmd => {
    handler.command = [...(handler.command || []), cmd];
    handler.help = [...(handler.help || []), `${cmd} <نص>`];
    handler.tags = [...(handler.tags || []), 'ai'];
});

handler.command = [...(handler.command || []), 'قائمة_الأصوات', 'voices', 'الاصوات'];
handler.help = [...(handler.help || []), 'قائمة_الأصوات - عرض الأصوات المتاحة', 'الاصوات'];
handler.tags = [...(handler.tags || []), 'tools'];

export default handler;
