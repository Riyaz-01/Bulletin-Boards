function formatDate(date = new Date()) {
	if (typeof date !== 'object') date = new Date(date);
	const day = date.getDate();
	const month = date.toLocaleString('en-US', { month: 'long' });
	const suffix = getDaySuffix(day);

	const formattedDate = `${day}${suffix} ${month}`;
	return formattedDate;
}

function getDaySuffix(day) {
	if (day >= 11 && day <= 13) {
		return 'th';
	}

	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

export default formatDate;
