import { useState } from 'react';
import ProjectItem from './ProjectItem';

const projectsData = [
    {
        id: 1,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 2,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 3,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 4,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 5,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 6,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        video: '/media/examplevideo.mp4',
        scope: 'Camera, Editor, Color Grading'
    }
];

function Projects() {
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleItemHover = (index) => {
        // Disable hover effects on mobile
        if (window.innerWidth > 1024) {
            setHoveredItem(index);
        }
    };

    const handleItemLeave = () => {
        setHoveredItem(null);
    };

    const getItemClasses = (index) => {
        const classes = ['project-item', 'inactive'];

        if (hoveredItem !== null && hoveredItem !== index) {
            classes.push('fade-text');
        }

        return classes.join(' ');
    };

    return (
        <div className="projects">
            {projectsData.map((project, index) => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    className={getItemClasses(index)}
                    onMouseEnter={() => handleItemHover(index)}
                    onMouseLeave={handleItemLeave}
                    isPlaying={hoveredItem === index}
                />
            ))}
        </div>
    );
}

export default Projects;
