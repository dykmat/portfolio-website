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
const interactiveElements = document.querySelectorAll('a, button, [onclick], .project-item');

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

// Project item hover interactions
const projectItems = document.querySelectorAll('.project-item');

projectItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        // Add fade-text class to all items except the hovered one
        projectItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.add('fade-text');
            }
        });
    });

    item.addEventListener('mouseleave', () => {
        // Remove fade-text class from all items
        projectItems.forEach(otherItem => {
            otherItem.classList.remove('fade-text');
        });
    });

    // Click to expand/collapse
    item.addEventListener('click', () => {
        const projectsGrid = document.querySelector('.projects');
        const itemIndex = Array.from(projectItems).indexOf(item);

        // Determine column (0-2) and row (0-1)
        const column = itemIndex % 3; // 0, 1, or 2
        const row = Math.floor(itemIndex / 3); // 0 or 1

        // Check if this item is already expanded
        const isExpanded = projectsGrid.classList.contains(`expand-col-${column + 1}`) &&
            projectsGrid.classList.contains(`expand-row-${row + 1}`);

        if (isExpanded) {
            // Reset grid to normal
            projectsGrid.className = 'projects';
            projectItems.forEach(projectItem => {
                projectItem.classList.remove('collapsed', 'collapsed-row');
            });
        } else {
            // Expand this item's column and row
            projectsGrid.className = 'projects';
            projectsGrid.classList.add(`expand-col-${column + 1}`);
            projectsGrid.classList.add(`expand-row-${row + 1}`);

            // Mark items based on their position
            projectItems.forEach((projectItem, index) => {
                const itemCol = index % 3;
                const itemRow = Math.floor(index / 3);

                if (itemRow !== row) {
                    // Items in different row - hide images completely
                    projectItem.classList.add('collapsed-row');
                    projectItem.classList.remove('collapsed');
                } else if (itemCol !== column) {
                    // Items in same row but different column - grayscale
                    projectItem.classList.add('collapsed');
                    projectItem.classList.remove('collapsed-row');
                } else {
                    // The expanded item
                    projectItem.classList.remove('collapsed', 'collapsed-row');
                }
            });
        }
    });
});
