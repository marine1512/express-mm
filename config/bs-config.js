module.exports = {
    proxy: "http://localhost:3000", // Adresse de votre serveur Node.js
    files: ["views/**/*.ejs", "public/**/*.*"], // Vos fichiers à surveiller
    port: 4000, // Port pour BrowserSync
    reloadDelay: 500,
};