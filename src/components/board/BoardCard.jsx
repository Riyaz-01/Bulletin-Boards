import React, { useRef, useState, forwardRef } from 'react';
import './BoardCard.scss';

// assets
import more from '../../assets/more.svg';
import edit from '../../assets/edit.svg';
import bin from '../../assets/bin.svg';

// helpers
import useOnClickOutside from '../../helpers/useOnClickOutside';

const BoardCard = forwardRef(
	(
		{
			board = {},
			onEdit = () => {},
			onDelete = () => {},
			onClick = () => {},
			...props
		},
		ref
	) => {
		const [showOptions, setShowOptions] = useState(false);
		const optionsRef = useRef(null);

		useOnClickOutside(optionsRef, () => setShowOptions(false));

		return (
			<div
				className='board'
				onClick={(e) => {
					e.stopPropagation();
					onClick();
				}}
				{...props}
				ref={ref}
			>
				<div className='board-color' style={{ background: board.color }} />
				<div className='board-content'>
					<div className='board-title'>{board.title}</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setShowOptions((prev) => !prev);
						}}
					>
						<img src={more} alt='more' />
					</button>
				</div>
				{showOptions && (
					<div className='options' ref={optionsRef}>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onEdit();
								setShowOptions(false);
							}}
						>
							<img src={edit} alt='edit' />
							Edit
						</button>
						<button
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
								setShowOptions(false);
							}}
						>
							<img src={bin} alt='bin' />
							Delete
						</button>
					</div>
				)}
			</div>
		);
	}
);

export default BoardCard;
