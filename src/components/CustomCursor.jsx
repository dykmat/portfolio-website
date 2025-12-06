import { useEffect, useState, useRef } from 'react';

function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [cursorType, setCursorType] = useState('default');
    const cursorRef = useRef(null);
    const rafId = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        let lastX = 0;
        let lastY = 0;
        let ticking = false;

        const updatePosition = () => {
            cursor.style.left = `${lastX}px`;
            cursor.style.top = `${lastY}px`;
            ticking = false;
        };

        const checkElementUnderCursor = (x, y) => {
            const element = document.elementFromPoint(x, y);
            if (!element) return;

            // Check if hovering over interactive elements
            const projectItem = element.closest('.project-item');
            const isInteractive = element.matches('a, button, [onclick]') || projectItem;
            
            setIsHovering(!!isInteractive);

            // Check if over active project item
            if (projectItem && projectItem.classList.contains('active')) {
                setCursorType('case-study');
            } else {
                setCursorType('default');
            }
        };

        const handleMouseMove = (e) => {
            lastX = e.clientX;
            lastY = e.clientY;
            
            // Check element under cursor on every move
            checkElementUnderCursor(e.clientX, e.clientY);
            
            if (!ticking) {
                ticking = true;
                rafId.current = requestAnimationFrame(updatePosition);
            }
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.matches('a, button, [onclick], .project-item')) {
                setIsHovering(true);
            }

            const projectItem = target.closest('.project-item');
            if (projectItem && projectItem.classList.contains('active')) {
                setCursorType('case-study');
            } else {
                setCursorType('default');
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target;
            if (target.matches('a, button, [onclick], .project-item')) {
                setIsHovering(false);
            }
            if (target.matches('.project-item.active')) {
                setCursorType('default');
            }
        };

        // Also listen for class changes on project items to update cursor immediately
        const handleClassChange = () => {
            const element = document.elementFromPoint(lastX, lastY);
            if (element) {
                const projectItem = element.closest('.project-item');
                if (projectItem && projectItem.classList.contains('active')) {
                    setCursorType('case-study');
                } else {
                    setCursorType('default');
                }
            }
        };

        // Use MutationObserver to watch for class changes on project items
        const observer = new MutationObserver(() => {
            // Use requestAnimationFrame to check after DOM updates
            requestAnimationFrame(() => {
                handleClassChange();
            });
        });
        
        // Observe the projects container for changes
        const projectsContainer = document.querySelector('.projects');
        if (projectsContainer) {
            observer.observe(projectsContainer, { 
                childList: true, 
                subtree: true, 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        }

        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseover', handleMouseOver, { passive: true });
        document.addEventListener('mouseout', handleMouseOut, { passive: true });

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
            observer.disconnect();
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className={`custom-cursor ${isHovering ? 'hovering' : ''} ${cursorType}`}
        />
    );
}

export default CustomCursor;
