import { useState, useEffect, useRef } from 'react';
import ProjectItem from './ProjectItem';

const projectsData = [
    {
        id: 1,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 2,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 3,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 4,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 5,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 6,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    }
];

function Projects() {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const projectsRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (projectsRef.current && !projectsRef.current.contains(event.target)) {
                setActiveItem(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleItemHover = (index) => {
        // Disable hover effects on mobile
        if (window.innerWidth > 1024) {
            setHoveredItem(index);
        }
    };

    const handleItemLeave = () => {
        setHoveredItem(null);
    };

    const handleItemClick = (index) => {
        if (activeItem === index) {
            setActiveItem(null);
        } else {
            setActiveItem(index);
        }
    };

    const getItemClasses = (index) => {
        const classes = ['project-item', 'inactive'];

        if (hoveredItem !== null && hoveredItem !== index) {
            classes.push('fade-text');
        }

        if (activeItem === index) {
            classes.push('active');
        }

        return classes.join(' ');
    };

    const getGridStyles = () => {
        if (activeItem === null) return {};

        const colIndex = activeItem % 3;
        const rowIndex = Math.floor(activeItem / 3);

        let gridTemplateColumns = '1fr 1fr 1fr';
        let gridTemplateRows = '1fr 1fr';

        if (colIndex === 0) gridTemplateColumns = '2fr 1fr 1fr';
        else if (colIndex === 1) gridTemplateColumns = '1fr 2fr 1fr';
        else if (colIndex === 2) gridTemplateColumns = '1fr 1fr 2fr';

        if (rowIndex === 0) gridTemplateRows = '2fr 1fr';
        else if (rowIndex === 1) gridTemplateRows = '1fr 2fr';

        return { gridTemplateColumns, gridTemplateRows };
    };

    return (
        <div className="projects" style={getGridStyles()} ref={projectsRef}>
            {projectsData.map((project, index) => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    className={getItemClasses(index)}
                    onMouseEnter={() => handleItemHover(index)}
                    onMouseLeave={handleItemLeave}
                    onClick={() => handleItemClick(index)}
                    isPlaying={hoveredItem === index}
                />
            ))}
        </div>
    );
}

export default Projects;
