import React, { useRef } from 'react';
import './ImageUpload.scss';

// assets
import img from '../../assets/img.svg';

const ImageUpload = ({ onChange = () => {}, image = '' }) => {
	const fileInputRef = useRef(null);

	const handleButtonClick = ({ image }) => {
		fileInputRef.current.click();
	};

	return (
		<div className='image-upload'>
			<input
				type='file'
				ref={fileInputRef}
				onChange={(e) => {
					onChange(e);
					e.target.value = '';
				}}
				style={{ display: 'none' }}
			/>
			{image && <img src={image} alt='image' className='uploaded-image' />}
			<button onClick={handleButtonClick}>
				<img src={img} alt='img' />
				<div className='button-text'>Add your image</div>
			</button>
		</div>
	);
};

export default ImageUpload;
