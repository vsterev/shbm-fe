import React, { useState, useEffect } from 'react';
import HotelCreateVariant from './HotelCreateVariant';
import styles from '../styles/AccommodationsMap.module.css'
import parseCookie from '../../utils/parseCookie';
import { HotelMap, HotelVariant } from '../../interfaces/hotel.interface';
import HotelService from '../../services/hotel';
// import {useNavigate} from 'react-router-dom'

interface HotelInfoProps {
  selectedHotelId: number | undefined;
  parserHotels: HotelMap[];
};

const HotelInfo = ({ selectedHotelId, parserHotels }: HotelInfoProps) => {
  // const navigate = useNavigate();
  const token = parseCookie('parser-token');
  const [interlookHotelName, setInterlookHotelName] = useState<string>('')
  const [properties, setProperties] = useState<HotelVariant>({} as HotelVariant);
  const [err, setErr] = useState<string>('');
  const [refresh, setRefresh] = useState<boolean>(false);
  // const [saved, setSaved] = useState('');
  // const hotelNameCheck = (hotelName) => {
  //   if (hotelName.includes('#')) {
  //     const regex = /(?<=#).*$/gm;
  //     return regex.exec(hotelName)[0]
  //   }
  //   return hotelName;
  // }
  useEffect(() => {
    if (!selectedHotelId) {
      return;
    }
    if (parserHotels.length > 0) {
      const hotel = parserHotels?.find(el => el._id === selectedHotelId)
      setInterlookHotelName(hotel?.hotelName || '')
      setProperties({} as HotelVariant);
      setErr('');
      HotelService
        // .variants({ hotelName: hotelNameCheck(selectedHotel) })
        .mappingVariants({ ilCode: selectedHotelId }, token)
        .then((r) => {
          console.log(r)
          if (r.error == 'Hotel map not found') {
            setErr(`${selectedHotelId} not synched`);
            setRefresh(false)
            return;
          }
          setProperties(r);
          setRefresh(false)
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [selectedHotelId, refresh]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>, el: number | string) => {
    const { name, value } = e.target as HTMLInputElement;
    const typedName = name as "rooms" | "boards";
    const index = name === 'boards' ? Number(el) : String(el);
    const temp = { ...properties[typedName] } as { [key: string]: { parserCode: string } };
    temp[index].parserCode = value;
    setProperties({ ...properties, [name]: temp });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('submithendler', { boards: properties.boards, rooms: properties.rooms });
    // setProperties({ ...properties, boards: tempBoard });
    HotelService
      .editMappingVariant({ hotelId: properties.hotelId, boards: properties.boards, rooms: properties.rooms }, token)
      .then(r => {
        console.log(r);
        // messageSuccess(r as unknown as string)
      })
      .catch(console.log)
  };

  // function messageSuccess(r: string) {
  //   setSaved('saved');
  //   setTimeout(() => setSaved(r), 3000)
  //   // navigate('/select') 
  // }

  return (
    <>
      <div className={styles.accomElements}>
        <h3>hotel Interlook Info for {interlookHotelName}:</h3>
        {err ?
          <div>
            {/* <div>{err}</div> */}
            <div><HotelCreateVariant selectedHotelId={selectedHotelId} setRefresh={setRefresh} /></div>
          </div>
          : <div>
            <h4>boards:</h4>
            <form onSubmit={submitHandler}>
              {properties?.boards &&
                Object.keys(properties?.boards).map((boardCode: string) => {
                  return (
                    <div key={boardCode}>
                      {properties?.boards[Number(boardCode)]?.boardId}, {properties?.boards[Number(boardCode)]?.boardName}{' '}
                      <input
                        type="text"
                        value={properties?.boards[Number(boardCode)]?.parserCode || ''}
                        name="boards"
                        onChange={(e) => changeHandler(e, boardCode)}
                      />
                    </div>
                  );
                })}
              <h4>rooms:</h4>
              {properties?.rooms &&
                Object.keys(properties?.rooms).map((el) => {
                  return (
                    <div key={el}>
                      {el}, {properties.rooms[el].roomTypeName} {properties.rooms[el].roomCategoryName}
                      <input
                        type="text"
                        value={properties.rooms[el]?.parserCode || ''}
                        name="rooms"
                        onChange={(e) => changeHandler(e, el)}
                        style={{ minWidth: `${properties.rooms[el]?.parserCode ? properties.rooms[el]?.parserCode.length + 5 : 'auto'}ch` }}
                      />
                    </div>
                  );
                })}
              <button className={styles.submitButton}>Submit</button>
            </form>
            {/* <div>{saved}</div> */}
          </div>}
      </div>
    </>
  );
};

export default HotelInfo;
