const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
  const scrollPosition = window.scrollY;
  const windowHeight = window.innerHeight;
  
  if (scrollPosition > 0) {
    const opacity = 1 - (scrollPosition / (windowHeight * 0.5));
    scrollIndicator.style.opacity = opacity > 0 ? opacity : 0;
    scrollIndicator.style.visibility = opacity <= 0 ? 'hidden' : 'visible';
  } else {
    scrollIndicator.style.opacity = 1;
    scrollIndicator.style.visibility = 'visible';
  }
});

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');
    const imageManagement = document.getElementById('image-management');
    const loginModal = document.getElementById('login-modal');
    const closeModal = loginModal.querySelector('.close');
    const galleryContainer = document.getElementById('gallery-container');
    const uploadForm = document.getElementById('upload-form');
    const imageManagementLink = document.getElementById('image-management-link');

    function updateUIForLoggedInUser() {
        loginLink.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        imageManagementLink.style.display = 'inline-block';
        imageManagement.style.display = 'block';
        loadImages();
    }
    
    function updateUIForLoggedOutUser() {
        loginLink.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        imageManagementLink.style.display = 'none';
        imageManagement.style.display = 'none';
        loadImages();
    }

    function checkAuthStatus() {
        const token = localStorage.getItem('auth-token');
        if (token) {
            updateUIForLoggedInUser();
        } else {
            updateUIForLoggedOutUser();
        }
    }

    checkAuthStatus();

    loginLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'block';
    });

    closeModal.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target == loginModal) {
            loginModal.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('auth-token', token);
                alert('Connexion réussie !');
                loginModal.style.display = 'none';
                updateUIForLoggedInUser();
            } else {
                const error = await response.text();
                alert(`Erreur de connexion : ${error}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la connexion');
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('auth-token');
        updateUIForLoggedOutUser();
        alert('Vous êtes déconnecté');
    });

    async function loadImages() {
        try {
            const response = await fetch('http://localhost:3000/images');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const images = await response.json();
            displayImages(images);
        } catch (error) {
            console.error('Erreur lors du chargement des images:', error);
            galleryContainer.innerHTML = `<p>Erreur lors du chargement des images: ${error.message}</p>`;
        }
    }

    function displayImages(images) {
        const isAdmin = !!localStorage.getItem('auth-token');
        galleryContainer.innerHTML = images.map(image => `
            <div class="gallery-item" data-id="${image._id}">
                <div class="image-container">
                    <img src="${image.path}" alt="${image.filename}">
                </div>
                <p>${image.description || 'Pas de description'}</p>
                ${isAdmin ? `
                    <div class="admin-controls">
                        <button class="edit-btn"></button>
                        <button class="delete-btn"></button>
                    </div>
                ` : ''}
            </div>
        `).join('');

        if (isAdmin) {
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', deleteImage);
            });
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', editImage);
            });
        }
    }

    async function deleteImage(event) {
        if (!localStorage.getItem('auth-token')) return;
        const imageId = event.target.closest('.gallery-item').dataset.id;
        if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
            try {
                const response = await fetch(`http://localhost:3000/image/${imageId}`, {
                    method: 'DELETE',
                    headers: {
                        'auth-token': localStorage.getItem('auth-token')
                    }
                });
                if (response.ok) {
                    alert('Image supprimée avec succès');
                    loadImages();
                } else {
                    const error = await response.text();
                    alert(`Erreur lors de la suppression : ${error}`);
                }
            } catch (error) {
                console.error('Erreur:', error);
                alert('Une erreur est survenue lors de la suppression');
            }
        }
    }

    function editImage(event) {
        if (!localStorage.getItem('auth-token')) return;
        const imageItem = event.target.closest('.gallery-item');
        const imageId = imageItem.dataset.id;
        const currentDescription = imageItem.querySelector('p').textContent;
        
        const newDescription = prompt('Entrez la nouvelle description:', currentDescription);
        
        if (newDescription !== null && newDescription !== currentDescription) {
            updateImageDescription(imageId, newDescription);
        }
    }

    async function updateImageDescription(imageId, newDescription) {
        try {
            const response = await fetch(`http://localhost:3000/image/${imageId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: JSON.stringify({ description: newDescription })
            });
            if (response.ok) {
                alert('Description mise à jour avec succès');
                loadImages();
            } else {
                const error = await response.text();
                alert(`Erreur lors de la mise à jour : ${error}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de la mise à jour');
        }
    }

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('http://localhost:3000/upload-image', {
                method: 'POST',
                headers: {
                    'auth-token': localStorage.getItem('auth-token')
                },
                body: formData
            });

            if (response.ok) {
                alert('Image uploadée avec succès');
                loadImages();
            } else {
                const error = await response.text();
                alert(`Erreur lors de l'upload : ${error}`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'upload');
        }
    });

    const topLink = document.getElementById('top-link');
    
    topLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const fileInput = document.getElementById('image-upload');
    const fileLabel = document.querySelector('.custom-file-upload');

    if (fileLabel) {
        fileLabel.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0] ? e.target.files[0].name : 'Aucun fichier choisi';
            fileLabel.textContent = fileName;
        });
    }

    if (imageManagementLink) {
        imageManagementLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (imageManagement) {
                imageManagement.style.display = 'block';
                imageManagement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    loadImages();
});