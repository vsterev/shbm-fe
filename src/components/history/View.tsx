import React, { useEffect, useState } from 'react';
import styles from '../styles/tableView.module.css';
import {
	Booking,
	SearchBookingsParams,
} from '../../interfaces/booking.interface';

interface HistoryViewProps {
	bookingsArr: Booking[];
	params: SearchBookingsParams;
}

const HistoryView = ({ bookingsArr, params }: HistoryViewProps) => {
	const [toggleArr, setToggleArr] = useState<boolean[]>([]);

	useEffect(() => {
		setToggleArr(new Array(bookingsArr.length).fill(false));
	}, [bookingsArr]);

	const toggleView = (index: number) => {
		setToggleArr(
			toggleArr.map((el, i) => {
				if (i === index) {
					return (el = !el);
				}
				return el;
			})
		);
	};

	return (
		<>
			{bookingsArr?.length > 0 ? (
				<table className={styles.bookings}>
					<thead>
						<tr>
							<th>№</th>
							<th>booking</th>
							<th>sent to integration</th>
							<th>action</th>
							<th>hotel</th>
							<th>room</th>
							<th>check-in</th>
							<th>check-out</th>
							<th>accomm.</th>
							<th>confirmation</th>
							<th>tourists</th>
							<th>date create in Il</th>
							<th>integration log</th>
						</tr>
					</thead>
					<tbody>
						{bookingsArr.map((el, i) => {
							return (
								<React.Fragment key={i}>
									<tr>
										<td>{i + 1 + params.skip}</td>
										<td>{el.bookingName}</td>
										<td>
											{el.log?.sendDate?.toString().substring(0, 16).replace('T', ' ')}
										</td>
										<td>{el.action}</td>
										<td>{el.hotelServices[0].hotel}</td>
										<td>
											{el.hotelServices[0].roomType}-
											{el.hotelServices[0].roomCategory}
										</td>
										<td>{el.hotelServices[0].checkIn?.substring(0, 10)}</td>
										<td>{el.hotelServices[0].checkOut?.substring(0, 10)}</td>
										<td>{el.hotelServices[0].roomAccommodation}</td>
										<td>{el.log?.response?.ConfirmationNo}</td>
										<td className={styles.bookingsName}>
											{el.hotelServices[0].tourists.map((el, i: number) => {
												return (
													<div key={i}>
														{el.sex}, {el.name},{' '}
														{el.birthDate?.substring(0, 10)}
													</div>
												);
											})}
										</td>
										<td>
											{el.creationDate?.substring(0, 16).replace('T', ' ')}
										</td>
										<td onClick={() => toggleView(i)}>
											<span>{toggleArr[i] === false ? 'view' : 'hide'}</span>
										</td>
									</tr>
									{toggleArr[i] === true && (
										<tr>
											<td colSpan={13}>
												{el?.log?.send?.Names &&
													el.log.send.Names.length > 0 && (
														<>
															<div>
																<h4>integration log:</h4>
																<pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
																	{JSON.stringify(el.log, null, 2)}
																</pre>
															</div>
														</>
													)}
												{el?.log?.manual && (
													<div>
														<h4>integration log:</h4>
														<pre style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
															{JSON.stringify(el.log.manual, null, 2)}
														</pre>
													</div>
												)}
											</td>
										</tr>
									)}
								</React.Fragment>
							);
						})}
					</tbody>
				</table>
			) : (
				<div style={{ textAlign: 'center' }}>please enter search criteria</div>
			)}
		</>
	);
};
export default HistoryView;
