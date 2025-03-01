let handler = async (m, { conn, text }) => {
  // Check if the user provided an image URL
  if (!text) {
    return m.reply('Please provide an image URL. Usage: .test <image_url>');
  }

  try {
    // Call the analyzeImage function with the provided image URL
    const analysisResult = await analyzeImage(text);

    // Send the analysis result back to the user
    await m.reply(JSON.stringify(analysisResult, null, 2));
  } catch (error) {
    console.error('Error:', error);
    await m.reply('Failed to analyze the image. Please try again later.');
  }
};

handler.help = handler.command = ['theyseeyourphotos'];
handler.tags = ['ai'];
export default handler;

/**
 * TheySeeYourPhotos
 * wm by natsumiworld / ty: dhiatimonodera
 * 
 * @param {string} imageUrl - The URL of the image to be analyzed.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the API if the request is successful.
 * @throws {Error} - Throws an error if the image fetch fails or if the API request fails.
 */
async function analyzeImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append("file", imageBlob, "blob");

    const headers = new Headers({
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      origin: "https://theyseeyourphotos.com",
      priority: "u=1, i",
      referer: "https://theyseeyourphotos.com/",
      "sec-ch-ua":
        '"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0",
    });

    const apiResponse = await fetch(
      "https://api.theyseeyourphotos.com/deductions",
      {
        method: "POST",
        headers,
        body: formData,
      },
    );

    if (!apiResponse.ok) {
      throw new Error(`HTTP error! Status: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
      }
