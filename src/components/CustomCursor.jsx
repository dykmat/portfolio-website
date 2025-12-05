import { useEffect, useState } from 'react';

function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = (e) => {
            if (e.target.matches('a, button, [onclick], .project-item')) {
                setIsHovering(true);
            }
        };

        const handleMouseLeave = (e) => {
            if (e.target.matches('a, button, [onclick], .project-item')) {
                setIsHovering(false);
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
        };
    }, []);

    return (
        <div
            className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        />
    );
}

export default CustomCursor;
