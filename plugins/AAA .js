import cheerio from 'cheerio';
import fetch from 'node-fetch';

const handler = async (m, { conn, text }) => {
  conn.armag = conn.armag ? conn.armag : {};
  if (!text) {
    throw *أدخل اسم الكتاب أو الرواية التي تريد البحث عنها مثال :*\n*.kitab مملكة الفراشة*;
  }
  delete conn.armag[m.chat];
  let res = await searchAlarabimag(text);
  const instructions = "▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁📢 *رد على الرسالة برقم الرواية لتحميلها*\n▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁\nاالميزة من طرف Midsoune 👏 \ninstagram.com/noureddine_ouafy";
  const smCaps = '¹ ² ³ ⁴ ⁵ ⁶ ⁷ ⁸ ⁹ ¹⁰ ¹¹ ¹² ¹³ ¹⁴ ¹⁵ ¹⁶ ¹⁷ ¹⁸ ¹⁹ ²⁰';
  const smCapsArray = smCaps.split(' ');

  let teks = res.slice(0, 20).map((item, index) => {
    return ${smCapsArray[index]} 📓 *${item.title}*;
  }).join("\n");

  const { key } = await conn.reply(m.chat, ${teks}\n\n${instructions});

  conn.armag[m.chat] = { list: res, key, timeout: setTimeout(() => { 
    delete conn.armag[m.chat]; }, 250000)};
}
handler.before = async (m, { conn }) => {
  conn.armag = conn.armag ? conn.armag : {};

  if (m.isBaileys || !(m.chat in conn.armag)) return;
  const input = m.text.trim();
  if (!/^\d+$/.test(input)) return; 
  const { list, key } = conn.armag[m.chat];
  const index = parseInt(input);

  const selectedNewsIndex = index - 1;
  if (selectedNewsIndex >= 0 && selectedNewsIndex < list.length) {
    const url = list[selectedNewsIndex].url;
    let item = await downloadAlarabimag(url);
    let cap = ‏📖 *${item.titles[0]}* 📖\n\n;
     cap += item.infos.map(info => ‏*${info.title}:* ${info.value}).join('\n');
    await conn.sendFile(m.chat, item.links[0], item.titles[0]+'.pdf', cap, m);

    clearTimeout(conn.armag[m.chat].timeout);
    conn.armag[m.chat].timeout = setTimeout(() => {
      delete conn.armag[m.chat];
    }, 3 * 60 * 1000);
  }
}
handler.help =['kitab'];
handler.tags = ['downloader'];
handler.command = /^(armag|kitab)$/i;
export default handler;


async function searchAlarabimag(text) {
  const url = 'https://www.alarabimag.com/search/?q=' + encodeURIComponent(text);

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  return $('.hotbooks').map((index, element) => ({
    title: $(element).find('h2 a').text().trim(),
    url: 'https://www.alarabimag.com' + $(element).find('h2 a').attr('href'),
    description: $(element).find('.info').text().trim(),
    imageSrc: 'https://www.alarabimag.com' + $(element).find('.smallimg').attr('src')
  })).get();
}

async function downloadAlarabimag(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const downloadLink = $('#download a').attr('href');
  const response2 = await fetch("https://www.alarabimag.com" + downloadLink);
  const data2 = await response2.text();
  const $$ = cheerio.load(data2);
  const links = $$('#download a').map((index, element) => 'https://www.alarabimag.com' + $$(element).attr('href')).get();
  const titles = $$('#download a').map((index, element) => $$(element).attr('title')).get();
  const infos = $$('.rTable').find('.rTableRow').map((_, row) => {
      const title = $(row).find('.rTableHead').text().trim();
      const value = $(row).find('.rTableCell').text().trim();
      return { title, value };
  }).get();
  console.log(infos)
  return {links, titles, infos};
      }
