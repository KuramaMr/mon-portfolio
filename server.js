require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const API_URL = 'https://mon-portfolio-backend.onrender.com';

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5500', 'https://portfolio-ferid.netlify.app']
}));
app.use('/uploads', express.static('uploads'));

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

// Configuration de multer pour le stockage des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Assurez-vous que ce dossier existe
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Modèle pour les images
const Image = mongoose.model('Image', new mongoose.Schema({
    filename: String,
    path: String,
    description: String
}));

// Route pour uploader une image
app.post('/upload-image', auth, upload.single('image'), async (req, res) => {
    if (req.file) {
        const newImage = new Image({
            filename: req.file.filename,
            path: `${API_URL}/uploads/${req.file.filename}`,
            description: req.body.description
        });
        await newImage.save();
        res.status(201).send('Image uploadée avec succès');
    } else {
        res.status(400).send('Erreur lors de l\'upload de l\'image');
    }
});

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
        
        // Supprimer le fichier
        const filePath = path.join(__dirname, 'uploads', path.basename(image.path));
        fs.unlink(filePath, (err) => {
            if (err) console.error('Erreur lors de la suppression du fichier:', err);
        });
        
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