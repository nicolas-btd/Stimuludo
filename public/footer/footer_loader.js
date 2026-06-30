document.addEventListener("DOMContentLoaded", function() {

        const loaderScript = document.querySelector('script[src*="footer_loader.js"]');

        if (!loaderScript) {
        console.error("Script footer_loader.js introuvable dans le DOM.");
        return;
    }

    const scriptUrl = loaderScript.src;
    const footerUrl = scriptUrl.replace('footer_loader.js', 'footer.html');
    const footerContainer = document.getElementById("footer-placeholder");

    if (footerContainer) {
        fetch(footerUrl)
            .then(response => {
                if (!response.ok) throw new Error("Fichier introuvable");
                return response.text();
            })
            .then(html => {
                if (html.includes("<title>")) {
                    throw new Error("Le chemin vers footer.html est incorrect.");
                }


                                                footerContainer.innerHTML = html;




                                                                if (typeof window.updateTranslations === 'function') {
                    window.updateTranslations();
                }

            })
            .catch(error => {
                console.error("Erreur Footer :", error);
                footerContainer.innerHTML = "<p style='text-align:center; color:red'>Erreur de chargement du footer.</p>";
            });
    }
});