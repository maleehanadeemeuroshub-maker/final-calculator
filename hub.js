/* ================================================================
     HUB SEARCH — filters the tool-picker cards on the home page
     ================================================================ */

const hubSearch  = document.getElementById('hubSearch');
const hubCards   = document.querySelectorAll('.hub-card');
const hubNoMatch = document.getElementById('hubNoMatch');

if (hubSearch) {
  hubSearch.addEventListener('input', () => {
    const q = hubSearch.value.trim().toLowerCase();
    let visibleCount = 0;
    hubCards.forEach(card => {
      const matches = card.dataset.name.includes(q);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });
    hubNoMatch.classList.toggle('hidden', visibleCount !== 0);
  });
}