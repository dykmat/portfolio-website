// Set header height for projects section
function setHeaderHeight() {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
}

// Call on load and resize
setHeaderHeight();
window.addEventListener('resize', setHeaderHeight);

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
const mobileNotification = document.getElementById('mobileNotification');
const email = 'contact@dykmat.com';

copyEmailBtn.addEventListener('click', async () => {
    try {
        // Copy to clipboard
        await navigator.clipboard.writeText(email);

        // Check if touch device (using matchMedia for pointer type)
        const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

        if (isTouchDevice) {
            // Show mobile notification
            mobileNotification.classList.add('show');

            // Hide after 2 seconds
            setTimeout(() => {
                mobileNotification.classList.remove('show');
            }, 2000);
        } else {
            // Show "Copied!" notification on cursor (desktop)
            cursor.classList.remove('hovering');
            cursor.classList.add('copied');

            // Remove the notification after 2 seconds
            setTimeout(() => {
                cursor.classList.remove('copied');
            }, 2000);
        }
    } catch (err) {
        console.error('Failed to copy email:', err);
    }
});

