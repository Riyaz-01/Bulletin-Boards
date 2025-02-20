import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './Boards.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// helpers
import { useNavigate } from 'react-router-dom';
import useCustomToast from '../../helpers/useCustomToast';

// components
import Header from '../../components/header/Header';
import Search from '../../components/search/Search';
import Button from '../../components/button/Button';
import PageContainer from '../../components/pageContainer/PageContainer';
import Modal from '../../components/modal/Modal';
import { Slide } from 'react-toastify';
import EmptyState from '../../components/emptyState/EmptyState';
import BoardCard from '../../components/board/BoardCard';

const Boards = ({ boards = [], setBoards = () => {} }) => {
	const [query, setQuery] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const { ToastContainer, successToast } = useCustomToast();
	const [editIndex, setEditIndex] = useState(-1);
	const [showEmtpyState, setShowEmptyState] = useState(false);
	const navigate = useNavigate();

	const showBoard = (title = '') => {
		if (title.toLowerCase().includes(query.toLowerCase()) || query == '')
			return true;

		return false;
	};

	const deleteItem = (item) => {
		const temp = boards.filter(function (value) {
			return value !== item;
		});
		setBoards(temp);
		localStorage.setItem('boards', JSON.stringify(temp));
		successToast('Board Removed Successfully');
	};

	const editItem = (index) => {
		setEditIndex(index);
		setOpenModal(true);
	};

	const closeModal = () => {
		setOpenModal(false);
	};

	const openPosts = (index) => {
		navigate(`/posts/${index}`);
	};

	const handleDragEnd = (result) => {
		// Don't reorder if fillter is on  or drag is off location
		if (!result.destination) {
			return;
		}

		const newItems = Array.from(boards);
		const [reorderedItem] = newItems.splice(result.source.index, 1);
		newItems.splice(result.destination.index, 0, reorderedItem);

		setBoards(newItems);
		localStorage.setItem('boards', JSON.stringify(newItems));
	};

	const checkEmpty = () => {
		if (boards.length == 0) {
			setShowEmptyState(true);
			return;
		}
		for (let i = 0; i < boards.length; ++i) {
			if (showBoard(boards[i].title)) {
				setShowEmptyState(false);
				return;
			}
		}
		setShowEmptyState(true);
	};

	useEffect(() => {
		checkEmpty();
	}, [query, boards]);

	return (
		<>
			<Modal
				isOpen={openModal}
				onClose={closeModal}
				title='Add a name for your board'
			>
				<ModalContent
					boards={boards}
					setBoards={setBoards}
					onClose={closeModal}
					editIndex={editIndex}
					setEditIndex={setEditIndex}
				/>
			</Modal>
			<Header
				showLogo={false}
				title='My Board'
				rightSection={
					<>
						<Search query={query} onChange={(e) => setQuery(e.target.value)} />
						<Button onClick={() => setOpenModal(true)}>Create new board</Button>
					</>
				}
			/>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId='droppable' direction='horizontal'>
					{(provided, snapshot) => (
						<PageContainer
							title='My boards'
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{!showEmtpyState ? (
								boards.map((board, index) => {
									if (showBoard(board.title))
										return (
											<Draggable
												key={board.title + index}
												draggableId={board.title + index}
												index={index}
											>
												{(provided, snapshot) => (
													<BoardCard
														board={board}
														onDelete={() => deleteItem(board)}
														onEdit={() => editItem(index)}
														index={index}
														key={board.title}
														onClick={() => openPosts(index)}
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													/>
												)}
											</Draggable>
										);
								})
							) : (
								<EmptyState type='board' />
							)}
						</PageContainer>
					)}
				</Droppable>
			</DragDropContext>
			<ToastContainer
				autoClose={3000}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='light'
				transition={Slide}
				className='Toastify__toast-container'
			/>
		</>
	);
};

export default Boards;

const ModalContent = ({
	boards = [],
	setBoards = () => {},
	onClose = () => {},
	editIndex = -1,
	setEditIndex = () => {},
}) => {
	const { successToast } = useCustomToast();
	const [title, setTitle] = useState('');
	const [selectedColor, setColor] = useState('rgba(167, 240, 249, 1)');
	const colors = [
		'rgba(167, 240, 249, 1)',
		'rgba(197, 197, 252, 1)',
		'rgba(255, 174, 192, 1)',
		'rgba(255, 204, 102, 1)',
	];

	const saveBoard = () => {
		const data = {
			color: selectedColor,
			title: title,
			posts: editIndex === -1 ? [] : boards[editIndex]?.posts,
		};
		let newBoards = boards;
		if (editIndex === -1) newBoards = [...newBoards, data];
		else newBoards[editIndex] = data;
		localStorage.setItem('boards', JSON.stringify(newBoards));

		setBoards(newBoards);
		if (editIndex == -1) successToast('Board Created Successfully');
		else successToast('Board Edited Successfully');
		setTitle('');
		setColor('rgba(167, 240, 249, 1)');
		onClose();
		setEditIndex(-1);
	};
	useEffect(() => {
		if (editIndex !== -1) {
			setTitle(boards[editIndex].title);
			setColor(boards[editIndex].color);
		}
	}, [editIndex]);
	return (
		<div className='modal-content'>
			<input
				className='modal-input'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder='Enter your board name'
			/>
			<h2>Select post color</h2>
			<p>Here are some templates to help you get started</p>

			<div className='colors'>
				{colors.map((color) => (
					<button
						className={'color ' + (color == selectedColor ? 'selected' : '')}
						style={{ background: color }}
						onClick={() => setColor(color)}
						key={color}
					/>
				))}
			</div>
			<Button showIcon={false} className='modal-button' onClick={saveBoard}>
				Create board
			</Button>
		</div>
	);
};
