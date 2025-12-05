// Custom cursor functionality
const cursor = document.querySelector('.custom-cursor');

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Add hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, [onclick]');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
    });
});

// Hide cursor when leaving the window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
});

// Copy email functionality
const copyEmailBtn = document.getElementById('copyEmailBtn');
const email = 'contact@dykmat.com';

copyEmailBtn.addEventListener('click', async () => {
    try {
        // Copy to clipboard
        await navigator.clipboard.writeText(email);

        // Show "Copied!" notification on cursor
        cursor.classList.remove('hovering');
        cursor.classList.add('copied');

        // Remove the notification after 2 seconds
        setTimeout(() => {
            cursor.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
});

