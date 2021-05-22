import React from 'react';
import './card.css';

export default function Card(props) {
    const stylesheet = {
        backgroundColor: props.color || '#0D6EFD',
        borderColor: props.color || '#0D6EFD'
    }
    
    return (
		<div className="Card" style={stylesheet}> 
    		<div className="Title">{props.titulo}</div>
			<div className="Content"> {props.children} </div>
		</div>
	);
}