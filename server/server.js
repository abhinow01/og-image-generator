const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'public')));

const generateOgImage = async (title, content, imageUrl) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set viewport to OG image dimensions
    await page.setViewport({ width: 1200, height: 630 });

    // Generate HTML content for the OG image
    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f0f2f5;
              margin: 0;
              padding: 40px;
              box-sizing: border-box;
              width: 1200px;
              height: 630px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .title {
              font-size: 48px;
              font-weight: bold;
              color: #1a1a1a;
              margin-bottom: 20px;
            }
            .content {
              font-size: 24px;
              color: #4a4a4a;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
            }
            .image {
              width: 100%;
              height: 300px;
              object-fit: cover;
              margin-top: 20px;
            }
            .logo {
              position: absolute;
              bottom: 20px;
              right: 20px;
              font-size: 24px;
              font-weight: bold;
              color: #1a1a1a;
            }
          </style>
        </head>
        <body>
          <div class="title">${title}</div>
          <div class="content">${content}</div>
          ${imageUrl ? `<img src="${imageUrl}" class="image" alt="Post image" />` : ''}
          <div class="logo">YourBrand</div>
        </body>
      </html>
    `;

    await page.setContent(html);

    const imagePath = path.join(__dirname, 'public', `og-image-${Date.now()}.png`);
    await page.screenshot({ path: imagePath });

    await browser.close();

    return imagePath;
  } catch (error) {
    console.error('Error in generateOgImage function:', error);
    throw error;
  }
};

app.post('/api/generate-og-image', async (req, res) => {
  const { title, content, image } = req.body;

  try {
    const imagePath = await generateOgImage(title, content, image);
    const imageUrl = `/images/${path.basename(imagePath)}`;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error generating OG image:', error);
    res.status(500).json({ error: 'Failed to generate OG image' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
