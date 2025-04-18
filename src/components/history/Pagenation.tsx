import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import appCookie from '../../utils/appCookie';
// import UserContext from '../../utils/userContext';
import styles from '../styles/pagenation.module.css';
import {
	Booking,
	SearchBookingsParams,
} from '../../interfaces/booking.interface';
import BookingService from '../../services/booking';

interface HistoryPagentaionProps {
	bookingsArr: Booking[];
	setBookingsArr: Dispatch<SetStateAction<Booking[]>>;
	setParams: Dispatch<SetStateAction<SearchBookingsParams>>;
	params: SearchBookingsParams;
}

const HistoryPagentaion = ({
	bookingsArr,
	setBookingsArr,
	setParams,
	params,
}: HistoryPagentaionProps) => {
	const [allPages, setAllPages] = useState<number | undefined>(undefined);
	const token = appCookie('hbs-token');
	// const { logOut } = useContext(UserContext)

	useEffect(() => {
		BookingService.search({ ...params, limit: 100, skip: 0 }, token).then(
			(res) => {
				// if ((num.msg)) {
				//     logOut();
				// }
				setAllPages(res.count);
			}
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [bookingsArr]);

	const clickHandler = (param: 'decr' | 'incr') => {
		if (param === 'decr') {
			const tempParams = { ...params, limit: 100, skip: params.skip - 100 };
			BookingService.search(tempParams, token).then((res) => {
				setBookingsArr(res.bookings);
				setParams(tempParams);
			});
		}
		if (param === 'incr') {
			const tempParams = { ...params, limit: 100, skip: params.skip + 100 };
			BookingService.search(tempParams, token).then((res) => {
				setBookingsArr(res.bookings);
				setParams(tempParams);
			});
		}
	};

	return (
		<>
			{bookingsArr?.length > 0 && allPages && (
				<div className={styles.pagenation}>
					<span>result: {allPages} records</span>
					<div>
						<button
							onClick={() => clickHandler('decr')}
							disabled={params.skip === 0}
						>
							{String.fromCharCode(60)}
						</button>
						&nbsp;&nbsp;{Math.ceil(params.skip / 100) + 1} page of{' '}
						{allPages < 100 ? '1' : Math.ceil(allPages / 100)}&nbsp;&nbsp;
						<button
							onClick={() => clickHandler('incr')}
							disabled={params.skip + 100 > allPages}
						>
							{String.fromCharCode(62)}
						</button>
					</div>
				</div>
			)}
		</>
	);
};
export default HistoryPagentaion;
