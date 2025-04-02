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
        alert("Une erreur imprévue est survenue.");
    } finally {
        button.disabled = false; // Réactiver le bouton
        button.textContent = "Supprimer"; // Réinitialiser le texte du bouton
    }
  }