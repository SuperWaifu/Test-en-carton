document.addEventListener('DOMContentLoaded', () => {
    const likeButton = document.getElementById('like-button');
    const likeCount = document.getElementById('like-count');

    // Fonction pour récupérer le nombre de "J'aime"
    const fetchLikes = () => {
        fetch('/api/likes')
            .then(response => response.json())
            .then(data => {
                likeCount.textContent = data.likes;
            })
            .catch(error => console.error('Erreur:', error));
    };

    // Fonction pour mettre à jour le nombre de "J'aime"
    const updateLikes = () => {
        fetch('/api/likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            fetchLikes(); // Mise à jour du compteur après un like
        })
        .catch(error => console.error('Erreur:', error));
    };

    likeButton.addEventListener('click', updateLikes);

    // Récupère le nombre de "J'aime" lors du chargement initial
    fetchLikes();
});