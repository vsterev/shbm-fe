import { useState, useEffect } from 'react';
import parserService from '../../services/parser';
import parseCookie from '../../utils/parseCookie';
import styles from '../styles/AccommodationsMap.module.css'
import { HotelMap } from '../../interfaces/hotel.interface';
import { ParserHotelInfoResponse } from '../../interfaces/parser.interface';

interface HotelParserInfoProps {
  selectedHotelId: number | undefined;
  mappedHotels: HotelMap[];
};

const HotelParserInfo = ({ selectedHotelId, mappedHotels }: HotelParserInfoProps) => {
  const [parserHotelName, setParserHotelName] = useState<string>('')
  const token = parseCookie('parser-token');
  const [legacyHotelProperties, setLegacyHotelProperties] = useState<ParserHotelInfoResponse | undefined>(undefined);

  useEffect(() => {
    if (mappedHotels.length > 0 && selectedHotelId) {
      const hotel = mappedHotels?.find(el => el._id === selectedHotelId)
      setParserHotelName(hotel?.parserName || '');
      const hotelParserCode = Number(hotel?.parserCode);
      parserService
        .hotelInfo({ parserCode: hotelParserCode }, token)
        .then((r) => {
          if (!r) {
            return;
          }
          setLegacyHotelProperties(r)
        })
        .catch(console.log);
    }
  }, [selectedHotelId, mappedHotels]);

  return (
    <>
      <div className={styles.accomElements}>
        <h3>hotel Parser Info for {parserHotelName}</h3>
        <h4>boards:</h4>
        {!!legacyHotelProperties &&
          legacyHotelProperties.boards.map((el, i) => {
            return <input type="text" key={i} value={el} disabled />;
          })}
        <h4>rooms:</h4>
        {!!legacyHotelProperties &&
          legacyHotelProperties.rooms.map((el, i) => {
            // return <div key={i}>{el.RoomType}</div>;
            return <input type="text" key={i} value={el.RoomType || ''} disabled style={{ width: '23%' }} />;
          })}
        {/* {JSON.stringify(properties)} */}
        {/* {JSON.stringify(parserHotels)} */}
      </div>
    </>
  );
};
export default HotelParserInfo;
