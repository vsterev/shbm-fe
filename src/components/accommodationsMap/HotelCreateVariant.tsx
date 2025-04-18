import React, { Dispatch, SetStateAction, useState } from 'react';
import appCookie from '../../utils/appCookie';
import styles from '../styles/AccommodationsMap.module.css';
import { toast } from 'react-toastify';
import { useIntegrationContext } from '../../contexts/integration.context';
import AccommodationService from '../../services/accommodation';
import ReactLoading from 'react-loading';

interface HotelCreateVariantProps {
	selectedHotelId: number | undefined;
	setRefresh: Dispatch<SetStateAction<boolean>>;
}

const HotelCreateVariant = ({
	selectedHotelId,
	setRefresh,
}: HotelCreateVariantProps) => {
	const [dateFrom, setDateFrom] = useState('');
	const [dateTo, setDateTo] = useState('');
	const token = appCookie('hbs-token');
	const [loader, setLoader] = useState(false);

	const { selectedIntegration } = useIntegrationContext();

	const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		if (!selectedHotelId || !selectedIntegration) {
			return;
		}
		e.preventDefault();
		setLoader(true);
		const accommodations = await AccommodationService.create(
			{ ilCode: selectedHotelId, checkIn: dateFrom, checkOut: dateTo, integrationCode: selectedIntegration.code },
			token
		).finally(() => {
			setLoader(false);
		});

		if (accommodations?.error) {
			toast.error(accommodations.error);
			return;
		} else {
			setRefresh(true);
		}

	};

	return (
		<>
			<div>
				Boards and accommodations are not synced, please fill this form to map
				it !
			</div>
			{loader ? <ReactLoading
				type="bubbles"
				color="blue"
				height={100}
				width={100}
			/> :
				<form onSubmit={submitHandler}>
					<div>
						<label htmlFor="dateFrom">date from: </label>
						<input
							type="date"
							id="dateFrom"
							name="dateFrom"
							value={dateFrom}
							onChange={(e) => {
								setDateFrom(e.target.value);
								setDateTo(e.target.value);
							}}
						/>
						<label htmlFor="dateTo">date to: </label>
						<input
							type="date"
							id="dateTo"
							name="dateTo"
							value={dateTo}
							onChange={(e) => setDateTo(e.target.value)}
						/>
					</div>
					<button className={styles.submitButton}>create variant</button>
				</form>
			}
		</>
	);
};
export default HotelCreateVariant;
