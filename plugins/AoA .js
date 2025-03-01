import axios from 'axios';

/**
 * Convert image buffer to a text prompt using an AI service.
 * @param {Buffer} buffer - The image buffer.
 * @returns {Promise<Object>} - The AI-generated prompt.
 */
async function imageToPrompt(buffer) {
  const image64 = `data:image/jpeg;base64,${buffer.toString('base64')}`;
  const { data } = await axios.post('https://www.chat-mentor.com/api/ai/image-to-text/', {
    imageUrl: image64,
    prompt: "Generate a text prompt for this image, focusing on visual elements, style, and key features."
  }, {
    headers: {
      "content-type": "application/json",
      "origin": "https://www.chat-mentor.com",
      "referer": "https://www.chat-mentor.com/features/image-to-prompt/",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  });
  return data;
}

/**
 * Handler for processing the image and converting it to a prompt.
 * @param {Object} m - The message object.
 * @param {Object} context - The context of the command (usedPrefix, command).
 * @returns {Promise<void>}
 */
let handler = async (m, { usedPrefix, command }) => {
  try {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    // Check if the message contains an image
    if (!mime || !mime.startsWith('image')) throw `Reply to an image with the caption *${usedPrefix + command}* or send an image with the caption *${usedPrefix + command}*`;

    // Download the image
    let media = await q.download();

    // Process the image to generate a prompt
    let result = await imageToPrompt(media);

    // Check if the result is valid and send the generated prompt
    if (result && result.result) {
      await m.reply(result.result);
    } else {
      throw 'Unable to process the image or the result is invalid.';
    }
  } catch (error) {
    console.error('Error in handler:', error);
    await m.reply(`Error: ${error.message || error}`);
  }
};

// Command setup
handler.help = ['img2prompt'];
handler.command = ['img2prompt'];
handler.tags = ['ai'];
handler.limit = false;

export default handler;
