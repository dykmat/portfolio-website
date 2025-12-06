import { useEffect, useState } from 'react';

function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [cursorType, setCursorType] = useState('default'); // 'default', 'case-study'

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.matches('a, button, [onclick], .project-item')) {
                setIsHovering(true);
            }

            if (e.target.matches('.project-item.active')) {
                setCursorType('case-study');
            } else {
                setCursorType('default');
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.matches('a, button, [onclick], .project-item')) {
                setIsHovering(false);
            }
            if (e.target.matches('.project-item.active')) {
                setCursorType('default');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
        <div
            className={`custom-cursor ${isHovering ? 'hovering' : ''} ${cursorType}`}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        />
    );
}

export default CustomCursor;
