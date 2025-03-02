import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import axios from 'axios';
import moment from 'moment-timezone';
import { fileURLToPath } from 'url'; 
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


let background = 'https://files.catbox.moe/53v1ol.jpg';


const fonts = [
  { name: 'اسم الخط : SDF', url: 'https://files.catbox.moe/rfw8ir.ttf' },
  { name: 'اسم الخط : GOUT', url: 'https://files.catbox.moe/4wc4gt.ttf' },
  { name: 'اسم الخط : HOUNTER', url: 'https://files.catbox.moe/wo0t2t.ttf' },
  { name: 'اسم الخط : KILLR', url: 'https://files.catbox.moe/s5y481.ttf' },
    { name: 'اسم الخط : ARIAL', url: 'https://files.catbox.moe/nqssdl.ttf' },
    { name: 'اسم الخط : JKL', url: 'https://files.catbox.moe/aksl76.ttf' }
];

const handler = async (m, { conn, text }) => {
  if (!text) {
    
    let fontList = fonts.map((font, index) => `*『${index + 1}』* *⧉┊ ${font.name}🌹*`).join('\n');
    return conn.reply(m.chat, `*┓━ ╼━━╃⌬〔اوبيتو بوت〕⌬╄━━╾ ━┏*\n*يرجى اختيار رقم الخط وعمله بعد الامر و مع نص الذي تريد عمله في تصميم 😁*\n\n${fontList}\n*╝═══❖『اوبيتو عمك』❖═══╚*`, m);
  }

  
  const args = text.split(' ');
  const fontNumber = parseInt(args[0]) - 1; 
  const userText = args.slice(1).join(' '); 

  if (isNaN(fontNumber) || !fonts[fontNumber]) {
    return conn.reply(m.chat, '*يرجى اختيار رقم خط صحيح 🤧🇲🇦*', m);
  }

  try {

    const outputDir = path.join(__dirname, './src/bostar');

    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }


    const backgroundResponse = await axios({
      url: background,
      responseType: 'arraybuffer',
    });
    const imageBuffer = Buffer.from(backgroundResponse.data, 'binary');

  
    const imagePath = path.join(outputDir, 'temp.jpg');
    fs.writeFileSync(imagePath, imageBuffer);

    
    const fontUrl = fonts[fontNumber].url;
    const fontResponse = await axios({
      url: fontUrl,
      responseType: 'arraybuffer',
    });
    const fontBuffer = Buffer.from(fontResponse.data, 'binary');


    const fontPath = path.join(outputDir, 'temp_font.ttf');
    fs.writeFileSync(fontPath, fontBuffer);


    const outputPath = path.join(outputDir, `output_${moment().format('YYYYMMDD_HHmmss')}.jpg`);

    
    ffmpeg(imagePath)
      .outputOptions([
        '-vf', `drawtext=text='${userText}':fontfile='${fontPath}':fontcolor=white:fontsize=185:x=(w-text_w)/2:y=(h-text_h)/2:fix_bounds=true` 
      ])
      .save(outputPath)
      .on('end', async () => {
     
        await conn.sendMessage(m.chat, { image: fs.readFileSync(outputPath), caption: '*تم انشاء تصميم بنجاح بواسطة اوبيتو بوت ♟🍁*' }, { quoted: m });


        fs.unlinkSync(imagePath);
        fs.unlinkSync(fontPath); 
      })
      .on('error', async (err) => {
        console.error('حدث خطأ أثناء إنشاء الصورة:', err.message);
        await conn.reply(m.chat, `حدث خطأ أثناء إنشاء الصورة: ${err.message}`, m);
      });

  } catch (error) {
    console.error('حدث خطأ أثناء إنشاء الصورة:', error.message);
    await conn.reply(m.chat, `حدث خطأ أثناء إنشاء الصورة: ${error.message}`, m);
  }
};

handler.help = ['خلفية'];
handler.tags = ['خلفية'];
handler.command = ['تصميم-خلفية'];

export default handler;
