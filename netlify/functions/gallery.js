const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../../data/gallery.json');

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      const fileContents = await fs.readFile(filePath, 'utf8');
      return {
        statusCode: 200,
        body: fileContents,
      };
    } else if (event.httpMethod === 'POST') {
      const gallery = JSON.parse(event.body);
      await fs.writeFile(filePath, JSON.stringify(gallery, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};