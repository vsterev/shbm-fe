import { Dispatch, SetStateAction, useState } from 'react';
import parseCookie from '../../utils/parseCookie';
import styles from '../styles/AccommodationsMap.module.css'
import HotelService from '../../services/hotel';

interface HotelCreateVariantProps {
    selectedHotelId: number | undefined;
    setRefresh: Dispatch<SetStateAction<boolean>>;
};

const HotelCreateVariant = ({ selectedHotelId, setRefresh }: HotelCreateVariantProps) => {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const token = parseCookie('parser-token');
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!selectedHotelId) {
            return
        };
        e.preventDefault();

        await HotelService
            .createMappingVariants({ ilCode: selectedHotelId, checkIn: dateFrom, checkOut: dateTo }, token);

        setRefresh(true)
    }
    return (
        <>
            <div>Boards and accommodations are not synced, please fill this form to map it !</div>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="dateFrom">date from: </label>
                    <input type="date" id="dateFrom" name="dateFrom" value={dateFrom} onChange={(e) => {
                        setDateFrom(e.target.value);
                        setDateTo(e.target.value)
                    }} />
                    <label htmlFor="dateTo">date to: </label>
                    <input type="date" id="dateTo" name="dateTo" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
                <button className={styles.submitButton}>create variant</button>
            </form>
        </>
    )

};
export default HotelCreateVariant;