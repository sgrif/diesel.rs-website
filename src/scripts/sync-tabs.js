// src/scripts/sync-tabs.js
function syncCodeLinks() {
    const storageKey = 'starlight-synced-tabs__db-backend';
    const activeDB = localStorage.getItem(storageKey) || 'postgres';
    const links = document.querySelectorAll('a.dynamic-db-link');

    links.forEach(link => {
        const template = link.getAttribute('data-template');
        if (template) {
            link.href = template.replace('[DB]', activeDB);
        }
    });
}

window.addEventListener('click', (e) => {
    if (e.target.closest('starlight-tabs')) {
        setTimeout(syncCodeLinks, 50);
    }
});

window.addEventListener('load', syncCodeLinks);
document.addEventListener('astro:after-swap', syncCodeLinks);
