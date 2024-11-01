function manageMessage() {
    const currentUrl = window.location.href;

    // Check if the current URL is that of a Medium article
    const isArticle = /\/@[\w-]+\/[\w-]+(?:\/[\w-]+)?(?:-[a-f0-9]{10})?$/.test(currentUrl) || /\/[\w-]+(?:\/[\w-]+)?(?:-[a-f0-9]{10})?$/.test(currentUrl);

    // Check if the message is already displayed
    const existingSuggestion = document.getElementById('freediumSuggestion');

    if (isArticle) {
        if (!existingSuggestion) {
            fetch(chrome.runtime.getURL('suggestion.html'))
                .then(response => response.text())
                .then(data => {
                    const div = document.createElement('div');
                    div.innerHTML = data;

                    const freediumLink = div.querySelector('#freediumLink');
                    freediumLink.href = `https://freedium.cfd/${currentUrl}`;

                    document.body.appendChild(div);
                });
        } else {
            const freediumLink = existingSuggestion.querySelector('#freediumLink');
            if (freediumLink) {
                freediumLink.href = `https://freedium.cfd/${currentUrl}`;
            }
        }
    } else {
        if (existingSuggestion) {
            existingSuggestion.remove();
        }
    }
}

manageMessage();

/* 
 * Observe all changes in the DOM to update the message
 */
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
            manageMessage();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

const pushState = history.pushState;
history.pushState = function(state) {
    pushState.apply(history, arguments);
    manageMessage(); 
};

const replaceState = history.replaceState;
history.replaceState = function(state) {
    replaceState.apply(history, arguments);
    manageMessage(); 
};

window.addEventListener('popstate', manageMessage);
