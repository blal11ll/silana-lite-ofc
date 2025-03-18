import fetch from 'node-fetch';

let toM = a => '@' + a.split('@')[0];

async function handler(m, { conn, groupMetadata }) {
    // لن يتم التحقق من الجواهر ولن يتم خصم أي شيء

    // قم بإرسال رسالة تأكيد الجريمة
    let ps = groupMetadata.participants.map(v => v.id);
    let a = ps[Math.floor(Math.random() * ps.length)];
    let b;
    do {
        b = ps[Math.floor(Math.random() * ps.length)];
    } while (b === a);

    // رابط الصورة الذي تريده
    const fgytSrdf = 'https://telegra.ph/file/5033ce0927bd3dc833da0.jpg';

    // إرسال الصورة مع الكابشن
    await conn.sendFile(m.chat, fgytSrdf, 'image.jpg', 
    `*🧬 اعــلان خــطــوبــه 🧬*\n` +
    `*❯💗 ╎الـخــاطــب : ${toM(a)}*\n` +
    `*❯🥹 ╎الــمـخـطــوبــه : ${toM(b)}*\n` +
    `*متنسوش تعزمونا علي الفرح يلا الف مبروك*\n` +
    `>ذاك الامير  معزوم`, 
    m, false, { mentions: [a, b] });
}

handler.help = ['formarpareja'];
handler.tags = ['main', 'fun'];
handler.command = ['اخطب', 'خطوبه'];
handler.group = true;

export default handler;
