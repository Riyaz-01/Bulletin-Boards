import React from 'react';
import './Search.scss';

// assets
import search from '../../assets/search.svg';

// components

const Search = ({ query = '', onChange = () => {} }) => {
	return (
		<div className='search-container'>
			<img src={search} alt='search' />
			<input
				type='text'
				value={query}
				onChange={onChange}
				placeholder='Search by title..'
			/>
		</div>
	);
};

export default Search;
