import axios from 'axios';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(`🧞 | *طريقة الاستخدام:*  
❖ أرسل الأمر *${usedPrefix}${command}* متبوعًا بسؤالك للحصول على إجابة من الذكاء الاصطناعي.  
📌 *مثال:*  
\`${usedPrefix}${command} ما هي نظرية النسبية؟\`  
🧞`);
  }

  try {
    let { data } = await axios.get(`https://fgsi1-restapi.hf.space/api/ai/copilot?text=${encodeURIComponent(text)}`);
    m.reply(`🧞 | *الإجابة:*  
${data?.data?.answer || '❌ لم أتمكن من العثور على إجابة.'}  
🧞`);
  } catch (e) {
    m.reply(`🧞 | ❌ *حدث خطأ أثناء جلب الإجابة. حاول مجددًا لاحقًا!*  
🧞`);
  }
};

// أوامر البوت باللغة العربية والإنجليزية
handler.help = ['copilot', 'مشعل'].map(v => v + ' - طرح سؤال على الذكاء الاصطناعي!');
handler.tags = ['ai'];
handler.command = /^(copilot|مشعل)$/i;

export default handler;
