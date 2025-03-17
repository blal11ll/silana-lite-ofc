import fetch from 'node-fetch';

const handler = async (m, { text, conn, args, command }) => {
  try {
    if (command === 'صور') {  
      if (!args.length) {
        return await m.reply("❌ يرجى توفير كلمة للبحث، مثال: \n*.صور Naruto*");
      }

      let query = args.join(" ");
      let searchApiUrl = `https://bk9.fun/search/pixabay?q=${encodeURIComponent(query)}`;

      try {
        let searchResponse = await fetch(searchApiUrl);
        let searchData = await searchResponse.json();

        if (!searchData?.status || !searchData?.BK9 || searchData.BK9.length === 0) {
          return await m.reply("❌ لم يتم العثور على أي نتائج.");
        }

        for (let i = 0; i < Math.min(5, searchData.BK9.length); i++) {
          await conn.sendMessage(m.chat, {
            image: { url: searchData.BK9[i] },
            caption: `📷 *نتيجة البحث عن:* _${query}_`
          }, { quoted: m });

          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (fetchError) {
        console.error("❌ خطأ أثناء جلب البيانات:", fetchError);
        return await m.reply("❌ حدث خطأ أثناء استرجاع البيانات من API.");
      }
    } else {
      await m.reply("❌ أمر غير معروف. استخدم: .صور [كلمة البحث]");
    }
  } catch (error) {
    console.error("❌ خطأ في تنفيذ الأمر:", error);
    await m.reply("❌ حدث خطأ أثناء تنفيذ الأمر.");
  }
};

handler.help = ["M O R I"];
handler.tags = ["D E V"];
handler.command = ['صور'];

export default handler;
