import React, { useEffect, useState } from 'react';
import './Posts.scss';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// assets
import bookmarkedIcon from '../../assets/bookmarked.svg';
import bookmarkIcon from '../../assets/bookmark.svg';

// helpers
import useCustomToast from '../../helpers/useCustomToast';
import imageToBase64 from '../../helpers/imageToBase64';

// components
import Header from '../../components/header/Header';
import Search from '../../components/search/Search';
import Button from '../../components/button/Button';
import PageContainer from '../../components/pageContainer/PageContainer';
import EmptyState from '../../components/emptyState/EmptyState';
import Modal from '../../components/modal/Modal';
import { useParams } from 'react-router-dom';
import ImageUpload from '../../components/imageUpload/ImageUpload';
import PostCard from '../../components/postCard/PostCard';
import { Slide } from 'react-toastify';

const Posts = ({ boards = [], setBoards = () => {} }) => {
	const { id } = useParams();

	const [posts, setPosts] = useState([]);
	const [showBookmarks, setShowBookmarks] = useState(false);
	const [query, setQuery] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);
	const { ToastContainer, successToast } = useCustomToast();
	const [showEmtpyState, setShowEmptyState] = useState(false);

	const showPost = (post = {}) => {
		if (
			(post.title.toLowerCase().includes(query.toLowerCase()) || query == '') &&
			(!showBookmarks || (showBookmarks && post.bookmark))
		)
			return true;
		return false;
	};

	const closeModal = () => {
		setOpenModal(false);
	};

	const deleteItem = (item) => {
		const newPosts = posts.filter(function (value) {
			return value !== item;
		});
		setPosts(newPosts);
		const newBoards = boards;
		newBoards[id].posts = newPosts;
		localStorage.setItem('boards', JSON.stringify(newBoards));
		successToast('Post Removed Successfully');
	};

	const editItem = (index) => {
		setEditIndex(index);
		setOpenModal(true);
	};

	const bookmarkItem = (index) => {
		let newPost = posts[index];
		newPost.bookmark = !newPost.bookmark;

		let newPosts = posts;
		newPosts[index] = newPost;
		setPosts(newPosts);

		let newBoards = boards;
		newBoards[id].posts = newPosts;
		localStorage.setItem('boards', JSON.stringify(newBoards));
	};

	const likeItem = (index) => {
		let newPost = posts[index];
		newPost.likes++;

		let newPosts = posts;
		newPosts[index] = newPost;
		setPosts(newPosts);

		let newBoards = boards;
		newBoards[id].posts = newPosts;
		localStorage.setItem('boards', JSON.stringify(newBoards));
	};

	const handleDragEnd = (result) => {
		// Don't reorder if fillter is on  or drag is off location
		if (!result.destination) {
			return;
		}

		const newItems = Array.from(posts);
		const [reorderedItem] = newItems.splice(result.source.index, 1);
		newItems.splice(result.destination.index, 0, reorderedItem);

		setPosts(newItems);
		let newBoards = boards;
		newBoards[id].posts = newItems;
		localStorage.setItem('boards', JSON.stringify(newBoards));
	};

	const checkEmpty = () => {
		if (posts.length == 0) {
			setShowEmptyState(true);
			return;
		}
		for (let i = 0; i < posts.length; ++i) {
			if (showPost(posts[i])) {
				setShowEmptyState(false);
				return;
			}
		}
		setShowEmptyState(true);
	};

	useEffect(() => {
		checkEmpty();
	}, [query, boards, posts]);

	useEffect(() => {
		setPosts(boards[id]?.posts);
	}, [boards]);

	return (
		<>
			<Header
				title={showBookmarks ? 'My Bookmarks' : boards[id]?.title}
				showBackButton={true}
				rightSection={
					<>
						<Search query={query} onChange={(e) => setQuery(e.target.value)} />

						<button
							className='bookmark-button'
							onClick={() => setShowBookmarks(!showBookmarks)}
						>
							<img
								src={showBookmarks ? bookmarkedIcon : bookmarkIcon}
								alt='bookmark'
							/>
						</button>
					</>
				}
			/>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId='droppable' direction='horizontal'>
					{(provided, snapshot) => (
						<PageContainer
							title='Your posts'
							background={boards[id]?.color}
							titleRightSection={
								<Button onClick={() => setOpenModal(true)}>
									Create new post
								</Button>
							}
							{...provided.droppableProps}
							ref={provided.innerRef}
						>
							{!showEmtpyState ? (
								posts.map((post, index) => {
									if (showPost(post))
										return (
											<Draggable
												key={post.date.toString() + post.title + index}
												draggableId={post.date.toString() + post.title + index}
												index={index}
											>
												{(provided, snapshot) => (
													<PostCard
														post={post}
														onBookmark={() => bookmarkItem(index)}
														onLike={() => likeItem(index)}
														onEdit={() => editItem(index)}
														onDelete={() => deleteItem(post)}
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													/>
												)}
											</Draggable>
										);
								})
							) : (
								<EmptyState type='post' />
							)}
							{provided.placeholder}
						</PageContainer>
					)}
				</Droppable>
			</DragDropContext>
			<Modal
				isOpen={openModal}
				onClose={closeModal}
				title='Create a post'
				subTitle='Write something for your post'
			>
				<ModalContent
					posts={posts}
					setPosts={setPosts}
					onClose={closeModal}
					editIndex={editIndex}
					setEditIndex={setEditIndex}
					boardId={id}
					boards={boards}
					setBoards={setBoards}
				/>
			</Modal>
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

export default Posts;

const ModalContent = ({
	boards = [],
	setBoards = () => {},
	posts = [],
	setPosts = () => {},
	onClose = () => {},
	editIndex = -1,
	setEditIndex = () => {},
	boardId = '',
}) => {
	const { successToast } = useCustomToast();
	const [post, setPost] = useState({ ...initialPost, boardId: boardId });

	const savePost = () => {
		let newPosts = posts;
		if (editIndex === -1) newPosts = [...newPosts, post];
		else newPosts[editIndex] = post;

		let newBoards = boards;
		newBoards[boardId].posts = newPosts;

		setBoards(newBoards);
		localStorage.setItem('boards', JSON.stringify(newBoards));

		setPosts(newPosts);
		if (editIndex == -1) successToast('Post Created Successfully');
		else successToast('Post Edited Successfully');
		setPost({ ...initialPost, boardId: boardId });
		onClose();
		setEditIndex(-1);
	};

	const handleImage = async (e) => {
		const file = e.target.files[0];
		const base64 = await imageToBase64(file);
		setPost((prev) => ({ ...prev, image: base64 }));
	};

	useEffect(() => {
		if (editIndex !== -1) {
			setPost(posts[editIndex]);
		}
	}, [editIndex]);

	return (
		<div className='modal-content'>
			<label htmlFor='subject'>Subject</label>
			<input
				name='subject'
				value={post.title}
				className='modal-input'
				placeholder='Type your subject'
				onChange={(e) =>
					setPost((prev) => ({ ...prev, title: e.target.value }))
				}
			/>
			<ImageUpload onChange={handleImage} image={post.image} />
			<hr />
			<label htmlFor='subject'>What's on your mind</label>
			<textarea
				value={post.description}
				className='modal-input'
				placeholder='Type here'
				onChange={(e) =>
					setPost((prev) => ({ ...prev, description: e.target.value }))
				}
			/>
			<Button showIcon={false} className='modal-button' onClick={savePost}>
				Publish
			</Button>
		</div>
	);
};

const initialPost = {
	title: '',
	bookmark: false,
	date: new Date(),
	image: '',
	description: '',
	likes: 0,
};
