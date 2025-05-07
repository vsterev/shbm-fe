import { useState } from 'react';
import SearchForm from '../components/history/SearchForm';
import HistoryView from '../components/history/View';
import { Helmet } from 'react-helmet-async';
import { Booking, SearchBookingsParams } from '../interfaces/booking.interface';
import { View, Text, Pagination } from 'reshaped';

const History = () => {
  const [bookingsArr, setBookingsArr] = useState<Booking[]>([]);
  const [count, setCount] = useState<number>(0);

  const rowsPerPage = 10;

  const [params, setParams] = useState<SearchBookingsParams>({
    booking: '',
    dateFrom: '',
    dateTo: '',
    limit: rowsPerPage,
    skip: 0,
    isCreateDate: true,
  });

  return (
    <View paddingInline={4} gap={2}>
      <Helmet>
        <title>HBS - History booking send</title>
      </Helmet>
      <Text variant="featured-2">Bookings history</Text>
      <SearchForm
        setBookingsArr={setBookingsArr}
        setCount={setCount}
        params={params}
        setParams={setParams}
      />
      <HistoryView bookingsArr={bookingsArr} params={params} />
      {bookingsArr.length && (
        <View align="center" paddingBottom={2}>
          <Pagination
            total={Math.floor(count / rowsPerPage)}
            previousAriaLabel="Previous page"
            nextAriaLabel="Next page"
            pageAriaLabel={(args) => `Page ${args.page}`}
            onChange={(args) => setParams({ ...params, skip: args.page * rowsPerPage })}
          />
        </View>
      )}
    </View>
  );
};
export default History;
