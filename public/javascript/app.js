document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      // Envoyer la requête au backend
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          "Authorization": "Bearer <votre_token>",
          'Content-Type': 'application/json', // Définir le type de contenu
        },
        body: JSON.stringify({ username, password }), // Envoyer les identifiants
      });

      if (!response.ok) {
        const error = await response.json(); // Récupérer le message d'erreur du backend
        throw new Error(error.error || "Erreur lors de la connexion.");
      }

      const data = await response.json(); // Récupération de la réponse JSON
      const token = data.token; // Récupérer le token

      if (token) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', token);

        // Redirection une fois le login réussi
        window.location.href = '/tableau'; // Redirige vers la section protégée
      } else {
        throw new Error("Erreur : Token non récupéré.");
      }
    } catch (error) {
      alert(error.message); // Gérer et afficher l'erreur
    }
  });
});

// Fonction de déconnexion
window.logout = () => {
  localStorage.removeItem('token'); // Supprime le token stocké
  window.location.href = '/'; // Redirection vers la page d'accueil
};