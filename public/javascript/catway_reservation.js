function toggleForm(id) {
    const form = document.getElementById(`update-form-${id}`);
    
    if (form) {
      form.style.display = (form.style.display === 'none' || !form.style.display) ? 'block' : 'none';
    } else {
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
    }
  }

  
function toggleReservationForm(reservationId) {
    const reservationForm = document.getElementById(`update-reservation-form-${reservationId}`);
    reservationForm.style.display = reservationForm.style.display === "none" || reservationForm.style.display === "" ? "block" : "none";
  }

  async function deleteReservation(event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire
  
    const form = event.target; // Récupère le formulaire soumis
    const url = form.action; // Récupère l'URL du formulaire
  
    const confirmation = confirm('Voulez-vous vraiment supprimer cette Catway ?');
    if (!confirmation) return;
  
    try {
        const response = await fetch(url, { method: 'POST' });
  
        if (response.ok) {
            // Redirige vers la liste après succès
            window.location.href = '/reservation';
        } else {
            alert("Erreur lors de la suppression. Veuillez réessayer.");
        }
    } catch (error) {
    }
  }