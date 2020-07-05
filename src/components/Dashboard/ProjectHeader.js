import React from 'react';
import './ProjectHeader.css'

const ProjectHeader = ({ name }) => {
    return (
        <div className="header">
            <h1>{name}</h1>
        </div>
    )
}

export default ProjectHeader;