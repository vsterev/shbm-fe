import { useState } from "react";
import Pagenation from "./history/Pagenation";
import SearchForm from "./history/SearchForm";
import View from "./history/View";
import styles from "./styles/History.module.css";
import { Helmet } from "react-helmet-async";
import { Booking, SearchBookingsParams } from "../interfaces/booking.interface";
// import PageTemplate from './PageTemplate';

const History = () => {
  const [bookingsArr, setBookingsArr] = useState<Booking[]>([]);
  const [params, setParams] = useState<SearchBookingsParams>({
    booking: "",
    dateFrom: "",
    dateTo: "",
    limit: 100,
    skip: 0,
    isCreateDate: true,
  });

  return (
    <>
      {/* <PageTemplate> */}
      <Helmet>
        <title>HBS - History booking send</title>
      </Helmet>
      <div className={styles.historyTopWrap}>
        <h2>Bookings history</h2>
        <SearchForm
          setBookingsArr={setBookingsArr}
          params={params}
          setParams={setParams}
        />
      </div>
      <View bookingsArr={bookingsArr} params={params} />
      <Pagenation
        bookingsArr={bookingsArr}
        setBookingsArr={setBookingsArr}
        params={params}
        setParams={setParams}
      />
      {/* </PageTemplate> */}
    </>
  );
};
export default History;
