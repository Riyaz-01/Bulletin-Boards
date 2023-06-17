import React from 'react';

// assets
import empty from '../../assets/empty.svg';

const EmptyState = ({ type = 'board' }) => {
	return (
		<div
			style={{
				width: '100%',
				height: '60vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: '8px',
			}}
		>
			<img src={empty} alt='404' />
			<div style={{ fontWeight: 700 }}>Nothing here yet</div>
			<div>Create your first {type} by clicking on the '+' button above</div>
		</div>
	);
};

export default EmptyState;
