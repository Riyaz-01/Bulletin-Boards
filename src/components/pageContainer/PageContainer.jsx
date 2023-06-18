import React, { forwardRef } from 'react';
import './PageContainer.scss';

const PageContainer = forwardRef(
	(
		{
			title = 'Title',
			titleRightSection = '',
			background = 'white',
			children = <></>,
			...props
		},
		ref
	) => {
		return (
			<div
				className='page-container'
				style={{ background: background }}
				{...props}
				ref={ref}
			>
				<div className='title'>
					<h2>{title}</h2>
					{titleRightSection}
				</div>
				<div className='content'>{children}</div>
			</div>
		);
	}
);

export default PageContainer;
