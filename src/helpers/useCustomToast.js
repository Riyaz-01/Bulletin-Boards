import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useCustomToast = (
	toastStyle = {
		position: 'top-center',
		autoClose: 3000,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: true,
	}
) => {
	const successToast = (msg = 'Success.') => toast.success(msg, toastStyle);
	const errorToast = (msg = 'Oops ! Something went wrong.') =>
		toast.error(msg, toastStyle);

	return { successToast, errorToast, ToastContainer };
};

export default useCustomToast;
