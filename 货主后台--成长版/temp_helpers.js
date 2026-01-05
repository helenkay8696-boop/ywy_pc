
// --- Helper Functions for Features ---

// Toggle Action Menu
window.toggleActionMenu = (id) => {
    const menu = document.getElementById(`action-menu-${id}`);
    if (menu) {
        // Close others
        document.querySelectorAll('.action-menu').forEach(m => {
            if (m.id !== `action-menu-${id}`) m.classList.add('hidden');
        });
        menu.classList.toggle('hidden');
        menu.style.display = menu.classList.contains('hidden') ? 'none' : 'block';
    }
};

// Global click to close menus
document.addEventListener('click', (e) => {
    if (!e.target.closest('.action-menu') && !e.target.closest('.btn-text')) {
        document.querySelectorAll('.action-menu').forEach(m => {
            m.classList.add('hidden');
            m.style.display = 'none';
        });
    }
});

// Mock Filter Logic
window.filterCargoList = () => {
    const client = document.getElementById('filter-client').value.toLowerCase();
    const start = document.getElementById('filter-start').value.toLowerCase();
    const end = document.getElementById('filter-end').value.toLowerCase();

    // In a real app, this would re-fetch or re-filter the main data source
    // For now, we simulate a "Filtered" toast because the render function pulls from window.cargoData2 directly
    // To make it real, we'd need to update a `currentFilters` state and re-render.

    // Let's implement a simple stateful filter for demo
    window.currentCargoFilters = { client, start, end };
    renderCargoManagement2(document.getElementById('view-container'));
};

// Update getFilteredData to use filters
const originalGetFilteredData = window.getFilteredData || (() => window.cargoData2);
// We need to inject this logic into the main render function or overwrite the helper if it exists.
// Since getFilteredData is defined *inside* renderCargoManagement2 in the previous file view, 
// we can't easily overwrite it from outside without modifying the render function itself.
// However, I can patch the render function in the next step. 
// For now, let's just show the Toast as per "Query button implementation" requirement (UI first), 
// but the user asked for "function realisation".
// I will modify renderCargoManagement2 to respect these values.
