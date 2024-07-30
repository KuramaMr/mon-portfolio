const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../../data/formations.json');

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod === 'GET') {
      const fileContents = await fs.readFile(filePath, 'utf8');
      return {
        statusCode: 200,
        body: fileContents,
      };
    } else if (event.httpMethod === 'POST') {
      const formations = JSON.parse(event.body);
      await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    } else if (event.httpMethod === 'PUT') {
      const newFormation = JSON.parse(event.body);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const formations = JSON.parse(fileContents);
      formations.push(newFormation);
      await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, id: newFormation.id }),
      };
    } else if (event.httpMethod === 'DELETE') {
      const { id } = JSON.parse(event.body);
      const fileContents = await fs.readFile(filePath, 'utf8');
      let formations = JSON.parse(fileContents);
      formations = formations.filter(formation => formation.id !== id);
      await fs.writeFile(filePath, JSON.stringify(formations, null, 2));
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