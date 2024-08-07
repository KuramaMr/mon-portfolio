describe('Tests des fonctionnalités admin', () => {
  const testImagePath = 'cypress/fixtures/test-image.png';
  const testImageName = 'Image de test Cypress';
  
  beforeEach(() => {
    // Visitez la page d'accueil
    cy.visit('/')
    
    // Cliquez sur le bouton Admin pour ouvrir le modal de connexion
    cy.get('#login-link').click()
    
    // Attendez que le modal de connexion soit visible
    cy.get('#login-modal').should('be.visible')
    
    // Remplissez le formulaire de connexion
    cy.get('#username').type(Cypress.env('ADMIN_USERNAME'))
    cy.get('#password').type(Cypress.env('ADMIN_PASSWORD'))
    cy.get('#login-form').submit()

    // Attendons que l'interface soit mise à jour
    cy.wait(6000) // Ajoutez un délai si nécessaire
    
    // Vérifiez que la connexion a réussi (le bouton de déconnexion devrait être visible)
    cy.get('#logout-button').should('be.visible')
  })
  
  it('Ajoute une nouvelle photo et la supprime', () => {
    // Cliquez sur le lien de gestion des images
    cy.get('#image-management-link').click()
    cy.get('#image-management').should('be.visible')
    
    cy.get('#gallery-container .gallery-item').then($items => {
      const initialCount = $items.length;
      
      cy.get('#image-upload').attachFile(testImagePath)
      cy.get('#image-description').type(testImageName)
      cy.get('#upload-form').submit()
      
      cy.get('#gallery-container .gallery-item').should('have.length', initialCount + 1)
      cy.contains(testImageName).should('be.visible')
      
      cy.contains(testImageName)
        .closest('.gallery-item')
        .find('.delete-btn')
        .click()
      
      cy.on('window:confirm', () => true)
      
      cy.get('#gallery-container .gallery-item').should('have.length', initialCount)
      cy.contains(testImageName).should('not.exist')
    })
  })
  
  it('Modifie la description d\'une image', () => {
    cy.get('#image-management-link').click()
    cy.get('#image-management').should('be.visible')

    const newDescription = 'Nouvelle description de test'

    cy.get('#gallery-container .gallery-item').first().as('firstImage')
    cy.get('@firstImage').find('.edit-btn').click()

    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns(newDescription)
    })

    cy.get('@firstImage').find('p').should('contain', newDescription)
  })
  
  afterEach(() => {
    // Déconnexion après chaque test
    cy.get('#logout-button').click()
    cy.get('#login-link').should('be.visible')
  })
})