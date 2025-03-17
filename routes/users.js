router.get("/users", authenticateToken, (req, res) => {
    const user = req.user; // Récupéré depuis le token
    res.json({
      id: user.id,
      username: user.username,
      password: user.password
    });
  });

const bcrypt = require("bcrypt");
const User = require("./models/user");

const createUser = async () => {
  const hashedPassword = await bcrypt.hash("votreMotDePasse", 10);
  const newUser = new User({
    username: "votreNomUtilisateur",
    password: hashedPassword,
    role: "admin", // Ou autre rôle si nécessaire
  });
  await newUser.save();
  console.log("Utilisateur créé avec succès !");
};

createUser();