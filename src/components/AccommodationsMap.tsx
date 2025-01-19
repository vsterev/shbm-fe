import { useState } from 'react';
import HotelParserInfo from './accommodationsMap/HotelParserInfo';
import HotelInterlookInfo from './accommodationsMap/HotelInterlookInfo';
import HotelSelect from './accommodationsMap/HotelSelect';
import styles from './styles/AccommodationsMap.module.css';
import { Helmet } from 'react-helmet-async'
import { HotelMap } from '../interfaces/hotel.interface';

const HotelPropertiesMap = () => {
  const [selectedHotelId, setSelectedHotelId] = useState<number | undefined>(undefined);
  const [mappedHotels, setMappedHotels] = useState<HotelMap[]>([]);

  return (
    <>
      <Helmet>
        <title>HBS - accommodation mapping tables</title>
      </Helmet>
      <div className={styles.accomWrap}>
        <h2>Accommodations mappings</h2>
        <div className={styles.innerAccomWrap}>
          <HotelSelect selectedHotelId={selectedHotelId} setSelectedHotelId={setSelectedHotelId} mappedHotels={mappedHotels} setMappedHotels={setMappedHotels} />
          <HotelParserInfo selectedHotelId={selectedHotelId} mappedHotels={mappedHotels} />
          <HotelInterlookInfo selectedHotelId={selectedHotelId} parserHotels={mappedHotels} />
        </div>
      </div>
    </>
  );
};
export default HotelPropertiesMap;
