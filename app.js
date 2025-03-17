const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Envoyer les identifiants
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json(); // Récupération du token
      const token = data.token;
  
      // Stocker le token dans localStorage (ou ailleurs)
      localStorage.setItem('token', token);
  
      // Redirection vers la page protégée
      window.location.href = './views/catways.ejs'; // Modifiez selon votre architecture
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      alert('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  const accessProtectedPage = async () => {
    const token = localStorage.getItem("token"); // Récupérer le token
  
    if (!token) {
      // Si aucun token, rediriger vers la page de login
      alert("Veuillez vous connecter.");
      window.location.href = "/login.ejs";
      return;
    }
  
    // Requête avec le token
    const response = await fetch("http://localhost:3000/protected", {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log("Données protégées :", data);
    } else {
      alert("Accès refusé. Votre session a expiré.");
      window.location.href = "/login.ejs";
    }
  };
  
  accessProtectedPage();

  if (!localStorage.getItem("token")) {
    window.location.href = "/protected.ejs"; // Rediriger vers login si non connecté
  }