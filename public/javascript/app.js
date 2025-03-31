document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      // Envoyer la requête au backend
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Envoyer les identifiants
      });

      if (!response.ok) {
        const error = await response.json(); // Récupérer l'erreur du backend
        throw new Error(error.error || "Erreur lors de la connexion.");
      }

      const data = await response.json(); // Récupération de la réponse JSON
      const token = data.token;

      if (token) {
        // Stocker le token dans le localStorage
        localStorage.setItem('token', token);

        // Redirection une fois le login réussi
        window.location.href = '/tableau'; // Redirige vers la section protégée
      } else {
        throw new Error("Erreur : Token non récupéré.");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error.message);
      alert(error.message);
    }
  });
  
});

window.logout = () => {
  console.log('Avant suppression :', localStorage.getItem('token')); // Afficher le token avant

  localStorage.removeItem('token'); // Supprime le token

  console.log('Après suppression :', localStorage.getItem('token')); // Vérifie s'il est supprimé

  // Redirection
  window.location.href = '/';
};