require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'mon-portfolio',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
const corsOptions = {
  origin: 'https://portfolio-ferid.netlify.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  })
  .catch((error) => {
    console.error('Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

// Modèle Admin
const Admin = mongoose.model('Admin', new mongoose.Schema({
    username: String,
    password: String
}));

// Route pour créer un admin (à utiliser une seule fois pour créer le compte)
app.post('/create-admin', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();
    res.status(201).send('Admin créé');
});

// Route de connexion
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).send('Utilisateur non trouvé');
    
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(400).send('Mot de passe incorrect');
    
    const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
    res.header('auth-token', token).send(token);
});

// Middleware pour vérifier le token
function auth(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Accès refusé');
    
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Token invalide');
    }
}

// Route protégée exemple
app.get('/admin-dashboard', auth, (req, res) => {
    res.send('Bienvenue sur le tableau de bord admin');
});

// Route pour uploader une image
app.post('/upload-image', auth, upload.single('image'), async (req, res) => {
    if (req.file) {
        const newImage = new Image({
            filename: req.file.filename,
            path: req.file.path,
            description: req.body.description
        });
        await newImage.save();
        res.status(201).send('Image uploadée avec succès');
    } else {
        res.status(400).send('Erreur lors de l\'upload de l\'image');
    }
});

// Modèle pour les images
const Image = mongoose.model('Image', new mongoose.Schema({
    filename: String,
    path: String,
    description: String
}));

// Route pour récupérer toutes les images
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.json(images);
    } catch (error) {
        console.error('Erreur lors de la récupération des images:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des images' });
    }
});

// Route pour supprimer une image
app.delete('/image/:id', auth, async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send('Image non trouvée');
        }
        
        // Supprimer l'image de Cloudinary
        const publicId = image.path.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        
        await Image.findByIdAndDelete(req.params.id);
        res.send('Image supprimée avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image:', error);
        res.status(500).send('Erreur lors de la suppression de l\'image');
    }
});

// Route pour modifier la description d'une image
app.patch('/image/:id', auth, async (req, res) => {
    try {
        const image = await Image.findByIdAndUpdate(req.params.id, 
            { description: req.body.description },
            { new: true }
        );
        if (!image) {
            return res.status(404).send('Image non trouvée');
        }
        res.json(image);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'image:', error);
        res.status(500).send('Erreur lors de la mise à jour de l\'image');
    }
});

// Route pour vérifier la validité du token
app.get('/verify-token', auth, (req, res) => {
    res.status(200).send('Token valide');
});

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction de validation du formulaire
function validateForm(nom, email, message) {
    if (!nom || nom.length < 2 || nom.length > 50) {
        return 'Le nom doit contenir entre 2 et 50 caractères.';
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Veuillez fournir une adresse email valide.';
    }
    if (!message || message.length < 10 || message.length > 1000) {
        return 'Le message doit contenir entre 10 et 1000 caractères.';
    }
    return null;
}

// Route pour le formulaire de contact
app.post('/submit-form', async (req, res) => {
    const { nom, email, message } = req.body;
    const error = validateForm(nom, email, message);
    if (error) {
        return res.status(400).send(error);
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'takenzmr@gmail.com', // L'email où vous voulez recevoir les messages
        subject: `Nouveau message de ${nom}`,
        text: `Nom: ${nom}\nEmail: ${email}\nMessage: \n${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Message envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).send('Erreur lors de l\'envoi du message');
    }
});

// Fonction pour migrer les images existantes vers Cloudinary
async function migrateImages() {
    const images = await Image.find();
    for (let image of images) {
        if (image.path.startsWith('http')) continue; // Déjà sur Cloudinary
        
        const localPath = path.join(__dirname, 'uploads', path.basename(image.path));
        if (fs.existsSync(localPath)) {
            const result = await cloudinary.uploader.upload(localPath);
            image.path = result.secure_url;
            await image.save();
            console.log(`Migrated: ${image.filename}`);
        } else {
            console.log(`File not found: ${image.filename}`);
        }
    }
    console.log('Migration complete');
}

// Vous pouvez appeler cette fonction une fois lors du démarrage du serveur si nécessaire
// migrateImages().then(() => console.log('Migration terminée'));