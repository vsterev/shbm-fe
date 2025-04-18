import { useState } from 'react';
import IntegrationHotelsInfo from './accommodationsMap/IntegrationHotelsInfo';
import HotelInterlookInfo from './accommodationsMap/HotelInterlookInfo';
import HotelSelect from './accommodationsMap/HotelSelect';
import styles from './styles/AccommodationsMap.module.css';
import { Helmet } from 'react-helmet-async';
import { HotelInterlook } from '../interfaces/hotel.interface';
import { useIntegrationContext } from '../contexts/integration.context';

const HotelPropertiesMap = () => {
	const [selectedHotelId, setSelectedHotelId] = useState<number | undefined>(
		undefined
	);
	const [mappedHotels, setMappedHotels] = useState<HotelInterlook[]>([]);
	const { selectedIntegration } = useIntegrationContext();

	if (!selectedIntegration) {
		return <h2 style={{ textAlign: 'center' }}>please select an integration</h2>
	}
	return (
		<>
			<Helmet>
				<title>HBS - accommodation mapping tables</title>
			</Helmet>
			<div className={styles.accomWrap}>
				<h2>Accommodations mappings</h2>
				<div className={styles.innerAccomWrap}>
					<HotelSelect
						selectedHotelId={selectedHotelId}
						setSelectedHotelId={setSelectedHotelId}
						mappedHotels={mappedHotels}
						setMappedHotels={setMappedHotels}
					/>
					<IntegrationHotelsInfo
						selectedHotelId={selectedHotelId}
						mappedHotels={mappedHotels}
					/>
					<HotelInterlookInfo selectedHotelId={selectedHotelId} />
				</div>
			</div>
		</>
	);
};
export default HotelPropertiesMap;
