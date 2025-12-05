import { useState } from 'react';
import ProjectItem from './ProjectItem';

const projectsData = [
    {
        id: 1,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 2,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 3,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 4,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 5,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        scope: 'Camera, Editor, Color Grading'
    },
    {
        id: 6,
        title: 'Video: How to find yourself',
        year: '2025',
        description: 'A deeply personal documentary exploring the journey of self-discovery through travel and introspection. This project captures authentic moments of transformation across three continents.',
        image: 'https://www.filmawka.pl/wp-content/uploads/2023/02/aftersun-2.jpeg',
        scope: 'Camera, Editor, Color Grading'
    }
];

function Projects() {
    const [expandedItem, setExpandedItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);

    const handleItemClick = (index) => {
        // Only enable expansion on desktop
        if (window.innerWidth <= 1024) {
            return;
        }

        if (expandedItem === index) {
            setExpandedItem(null);
        } else {
            setExpandedItem(index);
        }
    };

    const handleItemHover = (index) => {
        setHoveredItem(index);
    };

    const handleItemLeave = () => {
        setHoveredItem(null);
    };

    const getGridClasses = () => {
        if (expandedItem === null) return 'projects';

        const column = expandedItem % 3;
        const row = Math.floor(expandedItem / 3);

        return `projects expand-col-${column + 1} expand-row-${row + 1}`;
    };

    const getItemClasses = (index) => {
        const classes = ['project-item', 'inactive'];

        if (expandedItem !== null && expandedItem !== index) {
            const itemCol = index % 3;
            const itemRow = Math.floor(index / 3);
            const expandedCol = expandedItem % 3;
            const expandedRow = Math.floor(expandedItem / 3);

            if (itemRow !== expandedRow) {
                classes.push('collapsed-row');
            } else if (itemCol !== expandedCol) {
                classes.push('collapsed');
            }
        }

        if (hoveredItem !== null && hoveredItem !== index && expandedItem === null) {
            classes.push('fade-text');
        }

        return classes.join(' ');
    };

    return (
        <div className={getGridClasses()}>
            {projectsData.map((project, index) => (
                <ProjectItem
                    key={project.id}
                    project={project}
                    className={getItemClasses(index)}
                    onClick={() => handleItemClick(index)}
                    onMouseEnter={() => handleItemHover(index)}
                    onMouseLeave={handleItemLeave}
                />
            ))}
        </div>
    );
}

export default Projects;
