import { Dispatch, SetStateAction, FormEventHandler } from 'react';
import parseCookie from '../../utils/parseCookie';
import styles from '../styles/History.module.css'
import { Booking, SearchBookingsParams } from '../../interfaces/booking.interface';
import BookingService from '../../services/booking';

interface HistorySearchFormProps {
    params: SearchBookingsParams,
    setParams: Dispatch<SetStateAction<SearchBookingsParams>>,
    setBookingsArr: Dispatch<SetStateAction<Booking[]>>
}

const HistorySearchForm = ({ params, setParams, setBookingsArr }: HistorySearchFormProps) => {
    const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setParams({ ...params, limit: 100, skip: 0 });
        const token = parseCookie('parser-token');
        BookingService.find(params, token)
            .then((arr: Booking[]) => setBookingsArr(arr));
    }
    // const buttonDisabled = () => {
    //     const isDisabled = Object.values(params).reduce((sum, el) => sum + el.length, 0) === 0
    //     return isDisabled || params.booking.length < 6;
    // }
    return (
        <>
            <form onSubmit={submitHandler}>
                <fieldset>
                    <legend>search criteria:</legend>
                    <div>
                        <label htmlFor="byDateInp">by date send to parser</label>
                        <input type="radio" id="byDateInp" name="isByDate" value="yes" checked={params.isByDate === "yes"} onChange={() => setParams({ ...params, isByDate: "yes" })} />
                        <label htmlFor="byCheckIn">by check-in</label>
                        <input type="radio" id="byCheckIn" name="isByDate" value="name" checked={params.isByDate === "no"} onChange={() => setParams({ ...params, isByDate: "no" })} />
                    </div>
                    <div className={styles.searchTwoRow}>
                        <label htmlFor='booking'>booking number: </label>
                        <input type="text" name="booking" id="booking" value={params.booking} onChange={e => setParams({ ...params, booking: e.target.value })} />
                        <label htmlFor='dateFrom'>from: </label>
                        <input type="date" name="dateFrom" id="dateFrom" value={params.dateFrom} onChange={e => setParams({ ...params, dateFrom: e.target.value })} />
                        <label htmlFor='dateTo'>to: </label>
                        <input type="date" name="dateTo" id="dateTo" value={params.dateTo} onChange={e => setParams({ ...params, dateTo: e.target.value })} />
                        <button className={styles.submitButton}>submit</button>
                    </div>
                    {/* <button>Send</button> */}
                </fieldset>
            </form>
        </>
    )
}
export default HistorySearchForm;