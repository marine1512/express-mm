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

function toggleForm(id) {
  console.log('toggleForm appelée avec l’ID :', id); // Journalisez l'ID reçu
  const form = document.getElementById(`update-form-${id}`);
  
  if (form) {
    console.log('Formulaire trouvé pour l’ID :', id); // Formulaire ciblé trouvé
    form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
  } else {
    console.error(`Formulaire introuvable pour l’ID : ${id}`);
  }
}
async function deleteCatway(event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire

  const form = event.target; // Récupère le formulaire soumis
  const url = form.action; // Récupère l'URL du formulaire

  const confirmation = confirm('Voulez-vous vraiment supprimer cette Catway ?');
  if (!confirmation) return;

  try {
      const response = await fetch(url, { method: 'POST' });

      if (response.ok) {
          // Redirige vers la liste après succès
          window.location.href = '/catways';
      } else {
          alert("Erreur lors de la suppression. Veuillez réessayer.");
      }
  } catch (error) {
      console.error("Erreur lors de la suppression :", error);
  }
}
async function deleteUser(event) {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire

  const form = event.target; // Récupère le formulaire soumis
  const url = form.action; // Récupère l'URL du formulaire

  const confirmation = confirm('Voulez-vous vraiment supprimer cet utilisateur ?');
  if (!confirmation) return; // Si l'utilisateur annule, la suppression est interrompue

  const button = form.querySelector("button"); // Récupère le bouton de soumission
  button.disabled = true; // Désactive le bouton pendant la requête
  button.textContent = "Suppression en cours..."; // Ajoute un retour visuel

  try {
      const response = await fetch(url, {
          method: 'POST', // Méthode HTTP, avec `_method=DELETE` dans l'URL
          headers: {
              'Content-Type': 'application/json', // Facultatif si pas de corps dans la requête
          }
      });

      if (response.ok) {
          // Redirige si la suppression est un succès
          window.location.href = '/users';
      } else {
          const errorData = await response.json(); // Essayer de récupérer un message d'erreur JSON
          alert(errorData.message || "Erreur lors de la suppression.");
      }
  } catch (error) {
      // Affiche une erreur si la requête échoue
      console.error("Erreur lors de la suppression :", error);
      alert("Une erreur imprévue est survenue.");
  } finally {
      button.disabled = false; // Réactiver le bouton
      button.textContent = "Supprimer"; // Réinitialiser le texte du bouton
  }
}