function ProjectItem({ project, className, onClick, onMouseEnter, onMouseLeave }) {
    return (
        <div
            className={className}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="top-data">
                <p>{project.title}</p>
                <p>{project.year}</p>
            </div>
            <p className="project-info">{project.description}</p>
            <div className="media-container">
                <img src={project.image} alt={project.title} />
            </div>
            <div className="bottom-data">
                <div className="project-scope">
                    <p>Scope</p>
                    <p>{project.scope}</p>
                </div>
                <p>Details</p>
            </div>
        </div>
    );
}

export default ProjectItem;
