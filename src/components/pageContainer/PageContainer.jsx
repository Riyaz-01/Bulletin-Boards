import React from 'react';
import './PageContainer.scss';

const PageContainer = ({
	title = 'Title',
	titleRightSection = <></>,
	background = 'white',
	children = <></>,
}) => {
	return (
		<div className='page-container' style={{ background: background }}>
			<div className='title'>
				<h2>{title}</h2>
				{titleRightSection}
			</div>
			<div className='content'>{children}</div>
		</div>
	);
};

export default PageContainer;
