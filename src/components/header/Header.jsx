import React from 'react';
import './Header.scss';

// assets
import logo from '/logo.svg';
import back from '../../assets/back.svg';
import { useNavigate } from 'react-router-dom';

const Header = ({
	title = '',
	rightSection = <></>,
	showBackButton = false,
}) => {
	const navigate = useNavigate();
	const goBack = () => {
		navigate(-1);
	};

	return (
		<header>
			<div className='title'>
				{showBackButton && (
					<button className='back-button' onClick={goBack}>
						<img src={back} alt='back' />
					</button>
				)}
				<img src={logo} alt='logo' />
				<h1>{title}</h1>
			</div>
			<div className='right-section'>{rightSection}</div>
		</header>
	);
};

export default Header;
