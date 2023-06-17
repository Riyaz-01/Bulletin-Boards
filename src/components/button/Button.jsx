import React from 'react';
import './Button.scss';

// assets
import add from '../../assets/add.svg';

const Button = ({
	children = <></>,
	onClick = () => {},
	showIcon = true,
	...props
}) => {
	return (
		<button className={'button ' + props.className} onClick={onClick}>
			{showIcon && <img src={add} alt='add' />}
			<div className='button-text'>{children}</div>
		</button>
	);
};

export default Button;
