import moment from 'moment-timezone';

const handler = async (m, {conn}) => {
  const tzMA = moment().tz('Africa/Casablanca').format('DD/MM HH:mm'); // المغرب
  const tzDZ = moment().tz('Africa/Algiers').format('DD/MM HH:mm'); // الجزائر
  const tzTN = moment().tz('Africa/Tunis').format('DD/MM HH:mm'); // تونس
  const tzEG = moment().tz('Africa/Cairo').format('DD/MM HH:mm'); // مصر
  const tzSD = moment().tz('Africa/Khartoum').format('DD/MM HH:mm'); // السودان
  const tzLY = moment().tz('Africa/Tripoli').format('DD/MM HH:mm'); // ليبيا
  const tzMR = moment().tz('Africa/Nouakchott').format('DD/MM HH:mm'); // موريتانيا
  const tzSO = moment().tz('Africa/Mogadishu').format('DD/MM HH:mm'); // الصومال
  const tzDJ = moment().tz('Africa/Djibouti').format('DD/MM HH:mm'); // جيبوتي
  const tzKM = moment().tz('Indian/Comoro').format('DD/MM HH:mm'); // جزر القمر

  const tzSA = moment().tz('Asia/Riyadh').format('DD/MM HH:mm'); // السعودية
  const tzAE = moment().tz('Asia/Dubai').format('DD/MM HH:mm'); // الإمارات
  const tzKW = moment().tz('Asia/Kuwait').format('DD/MM HH:mm'); // الكويت
  const tzQA = moment().tz('Asia/Qatar').format('DD/MM HH:mm'); // قطر
  const tzBH = moment().tz('Asia/Bahrain').format('DD/MM HH:mm'); // البحرين
  const tzOM = moment().tz('Asia/Muscat').format('DD/MM HH:mm'); // عمان
  const tzYE = moment().tz('Asia/Aden').format('DD/MM HH:mm'); // اليمن
  const tzIQ = moment().tz('Asia/Baghdad').format('DD/MM HH:mm'); // العراق
  const tzSY = moment().tz('Asia/Damascus').format('DD/MM HH:mm'); // سوريا
  const tzLB = moment().tz('Asia/Beirut').format('DD/MM HH:mm'); // لبنان
  const tzJO = moment().tz('Asia/Amman').format('DD/MM HH:mm'); // الأردن
  const tzPS = moment().tz('Asia/Gaza').format('DD/MM HH:mm'); // فلسطين

  const imageUrl = 'https://telegra.ph/file/1ac32965e723a693dd35a.jpg'; // رابط الصورة

  const messageText = `\`\`\`
< التوقيت العربي👨🏻‍💻 />

▢ المغرب     : ${tzMA}
▢ الجزائر   : ${tzDZ}
▢ تونس      : ${tzTN}
▢ مصر       : ${tzEG}
▢ السودان    : ${tzSD}
▢ ليبيا     : ${tzLY}
▢ موريتانيا : ${tzMR}
▢ الصومال   : ${tzSO}
▢ جيبوتي    : ${tzDJ}
▢ جزر القمر : ${tzKM}
▢ السعودية  : ${tzSA}
▢ الإمارات  : ${tzAE}
▢ الكويت    : ${tzKW}
▢ قطر       : ${tzQA}
▢ البحرين   : ${tzBH}
▢ عمان      : ${tzOM}
▢ اليمن     : ${tzYE}
▢ العراق    : ${tzIQ}
▢ سوريا     : ${tzSY}
▢ لبنان     : ${tzLB}
▢ الأردن    : ${tzJO}
▢ فلسطين    : ${tzPS}
\`\`\`
${String.fromCharCode(8206).repeat(850)}
▢ TZ del servidor:\n • ${Intl.DateTimeFormat().resolvedOptions().timeZone}\n • ${moment().tz(Intl.DateTimeFormat().resolvedOptions().timeZone).format('DD/MM HH:mm')}`;

  await conn.sendMessage(m.chat, { image: { url: imageUrl }, caption: messageText }, { quoted: m });
};

handler.command = /^(tz|التوقيت|fecha|horario)$/i;
export default handler;
