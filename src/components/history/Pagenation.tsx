import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import parseCookie from '../../utils/parseCookie';
// import UserContext from '../../utils/userContext';
import styles from '../styles/pagenation.module.css'
import { Booking, SearchBookingsParams } from '../../interfaces/booking.interface';
import BookingService from '../../services/booking';

interface HistoryPagentaionProps {
    bookingsArr: Booking[],
    setBookingsArr: Dispatch<SetStateAction<Booking[]>>,
    setParams: Dispatch<SetStateAction<SearchBookingsParams>>,
    params: SearchBookingsParams
}

const HistoryPagentaion = (({ bookingsArr, setBookingsArr, setParams, params }: HistoryPagentaionProps) => {
    const [allPages, setAllPages] = useState<number | undefined>(undefined)
    const token = parseCookie('parser-token');
    // const { logOut } = useContext(UserContext)

    useEffect(() => {
        BookingService.length({ ...params, limit: 100, skip: 0 }, token)
            .then(num => {
                // if ((num.msg)) {
                //     logOut();
                // }
                setAllPages(num);
            })
    }, [bookingsArr]);

    const clickHandler = (param: "decr" | "incr") => {
        if (param === 'decr') {
            const tempParams = { ...params, limit: 100, skip: params.skip - 100 }
            BookingService.find(tempParams, token)
                .then(arr => {
                    setBookingsArr(arr);
                    setParams(tempParams);
                })
        }
        if (param === 'incr') {
            const tempParams = { ...params, limit: 100, skip: params.skip + 100 };
            BookingService.find(tempParams, token)
                .then(arr => {
                    setBookingsArr(arr);
                    setParams(tempParams);
                })
        }
    }

    return (
        <>
            {bookingsArr?.length > 0 && allPages &&
                <div className={styles.pagenation}>
                    <span>result: {allPages} records</span>
                    <div>
                        <button onClick={() => clickHandler('decr')} disabled={params.skip === 0}>{String.fromCharCode(60)}</button>
                        &nbsp;&nbsp;{Math.ceil(params.skip / 100) + 1} page of {allPages < 100 ? '1' : Math.ceil(allPages / 100)}&nbsp;&nbsp;
                        <button onClick={() => clickHandler('incr')} disabled={params.skip + 100 > allPages}>{String.fromCharCode(62)}</button>
                    </div>
                </div>
            }
        </>
    )
}
)
export default HistoryPagentaion;