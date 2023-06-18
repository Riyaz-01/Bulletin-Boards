import React, { useRef, useState, forwardRef } from 'react';
import './PostCard.scss';

// assets
import bookmarkIcon from '../../assets/bookmark.svg';
import bookmarkedIcon from '../../assets/bookmarked.svg';
import more from '../../assets/more.svg';
import heart from '../../assets/heart.svg';
import heartRed from '../../assets/heartRed.svg';
import edit from '../../assets/edit.svg';
import bin from '../../assets/bin.svg';

// helpers
import useOnClickOutside from '../../helpers/useOnClickOutside';
import formatDate from '../../helpers/formatDate';

const PostCard = forwardRef(
	(
		{
			post = {
				title: '',
				bookmark: false,
				date: new Date(),
				image: '',
				description: '',
				likes: 0,
			},
			onEdit = () => {},
			onDelete = () => {},
			onBookmark = () => {},
			onLike = () => {},
			...props
		},
		ref
	) => {
		const [showOptions, setShowOptions] = useState(false);
		const [bookmark, setBookmark] = useState(post.bookmark);
		const [likes, setLikes] = useState(post.likes);

		const optionsRef = useRef(null);
		useOnClickOutside(optionsRef, () => setShowOptions(false));
		return (
			<div className='post-card' {...props} ref={ref}>
				{showOptions && (
					<div className='options' ref={optionsRef}>
						<button
							onClick={() => {
								onEdit();
								setShowOptions(false);
							}}
						>
							<img src={edit} alt='edit' />
							Edit
						</button>
						<button
							onClick={() => {
								onDelete();
								setShowOptions(false);
							}}
						>
							<img src={bin} alt='bin' />
							Delete
						</button>
					</div>
				)}
				<div className='post-title'>
					<div className='post-title-text'>{post.title}</div>
					<div className='post-actions'>
						<button
							onClick={() => {
								setBookmark(!bookmark);
								onBookmark();
							}}
						>
							<img src={bookmark ? bookmarkedIcon : bookmarkIcon} alt='' />
						</button>

						<button onClick={() => setShowOptions((prev) => !prev)}>
							<img src={more} alt='' />
						</button>
					</div>
				</div>
				<div className='post-date'>{formatDate(post.date)}</div>
				<img src={post.image} alt='img' className='post-image' />
				<div className='post-description'>{post.description}</div>
				<hr />
				<div className='post-likes'>
					<button
						onClick={() => {
							setLikes((prev) => prev + 1);
							onLike(likes);
						}}
					>
						<img src={likes > 0 ? heartRed : heart} alt='like' />
					</button>
					<div>{likes}</div>
				</div>
			</div>
		);
	}
);

export default PostCard;
