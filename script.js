document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply the saved theme on page load
    document.body.classList.add(currentTheme + '-theme');
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        // Toggle the theme
        const isDark = document.body.classList.contains('dark-theme');
        document.body.classList.remove(isDark ? 'dark-theme' : 'light-theme');
        document.body.classList.add(isDark ? 'light-theme' : 'dark-theme');
        
        // Save the new theme to local storage
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        
        // Update the button icon
        themeToggle.textContent = isDark ? '🌙' : '☀️';
    });
});
