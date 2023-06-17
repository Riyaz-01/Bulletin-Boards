import { useEffect, useState } from 'react';

// utils
import { Route, Routes, BrowserRouter } from 'react-router-dom';

// pages
import Boards from './pages/boards/Boards';
import Posts from './pages/posts/Posts';

function App() {
	const [boards, setBoards] = useState([]);

	useEffect(() => {
		const items = JSON.parse(localStorage.getItem('boards'));
		setBoards(items ? items : []);
	}, []);
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path='/'
						element={<Boards boards={boards} setBoards={setBoards} />}
					/>
					<Route
						path='/posts/:id'
						element={<Posts boards={boards} setBoards={setBoards} />}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
