const authService = require('../services/authService'); // Import du service approprié

// Affiche le formulaire de connexion
exports.getLoginPage = (req, res) => {
  res.render('login'); // Renvoie la vue de connexion
};

// Gère les connexions utilisateur
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const { token, newUser } = await authService.login(username, password);

    // Configure et envoie le cookie au client
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 heure en millisecondes
    });

    res.status(200).json({ message: 'Connexion réussie', user: newUser });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

// Gère les déconnexions utilisateur
exports.logout = (req, res) => {
  try {
// Supprime le cookie lié à l'authentification (token)
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Déconnexion réussie.' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la déconnexion.' });
  }
};