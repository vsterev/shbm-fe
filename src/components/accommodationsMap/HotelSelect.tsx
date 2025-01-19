import { Dispatch, SetStateAction, useEffect } from 'react';
import parseCookie from '../../utils/parseCookie';
// import UserContext from '../../utils/userContext';
import styles from '../styles/AccommodationsMap.module.css'
import { HotelInterlook } from '../../interfaces/hotel.interface';
import HotelService from '../../services/hotel';

interface HotelSelectProps {
  selectedHotelId: number | undefined;
  setSelectedHotelId: Dispatch<SetStateAction<number | undefined>>;
  mappedHotels: HotelInterlook[];
  setMappedHotels: Dispatch<SetStateAction<HotelInterlook[]>>;
}

function HotelSelect({ selectedHotelId, setSelectedHotelId, mappedHotels, setMappedHotels }: HotelSelectProps) {
  // const { logOut } = useContext(UserContext)

  const getParserHotels = () => {
    const token = parseCookie('parser-token');
    return HotelService
      .allMappedHotels(token)
      .then((hotels) => {
        // if (hotels.msg) {
        //   logOut();
        // }
        setMappedHotels(hotels);
      })
      .catch(() => console.log('Error fetching mapped hotels!'));
  };

  useEffect(() => {
    getParserHotels()
  }
    , []);

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHotelId(e.target.value ? +e.target.value : undefined);
  };

  return (
    <>
      <div className={styles.accomElements}>
        <div>Select hotel from Parsing System</div>
        <div>
          {!mappedHotels ? (
            <div>Loading...</div>
          ) : (
            <select id="select" value={selectedHotelId} onChange={changeHandler}>
              {!selectedHotelId && <option value="">choise a hotel</option>}
              {Array.isArray(mappedHotels) && mappedHotels?.map((el) => {
                return (
                  <option key={el._id} value={el._id}>
                    {el.name}
                  </option>
                );
              })}
            </select>
          )}
        </div>
      </div>
    </>
  );
}
export default HotelSelect;
