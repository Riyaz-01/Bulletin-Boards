import React, { useRef } from 'react';
import './Modal.scss';

// assets
import cross from '../../assets/cross.svg';
import useOnClickOutside from '../../helpers/useOnClickOutside';

const Modal = ({
	isOpen = false,
	onClose = () => {},
	children = <></>,
	title = 'Title',
	subTitle = '',
}) => {
	const modalStyles = {
		display: isOpen ? 'flex' : 'none',
	};
	const modalRef = useRef(null);
	useOnClickOutside(modalRef, onClose);

	return (
		<div style={modalStyles} className='modal'>
			<div className='modal-content' ref={modalRef}>
				<div className='modal-title'>
					<div className='modal-title-text'>
						<h1>{title}</h1>
						<div className='subtitle'>{subTitle}</div>
					</div>
					<button onClick={onClose}>
						<img src={cross} alt='cross' />
					</button>
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
};

export default Modal;
