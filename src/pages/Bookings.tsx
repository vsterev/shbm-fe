import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BookingService from '../services/booking';
import appCookie from '../utils/appCookie';
import { Booking } from '../interfaces/booking.interface';
import { useIntegrationContext } from '../contexts/integration.context';
import { Button, Text, View } from 'reshaped';
import { RefreshCw } from 'react-feather';
import BookingSection from '../components/bookings/BookingSection';
import useToastService from '../utils/toastService';

interface ResultSendBookings {
  errors: number;
  sended: number;
  confirmed: number;
  notConfirmed: number;
  cancelled: number;
}

const GetBookings = () => {
  const [newBookings, setNewBookings] = useState<Booking[]>([]);
  const [newArr, setNewArr] = useState<boolean[]>([]);
  const [changedBookings, setChangedBookings] = useState<Booking[]>([]);
  const [changeArr, setChangeArr] = useState<boolean[]>([]);
  const [cancelBookings, setCancelBookings] = useState<Booking[]>([]);
  const [cancelArr, setCancelArr] = useState<boolean[]>([]);
  const [refresh, setRefresh] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState({
    new: false,
    change: false,
    cancel: false,
  });

  const token = appCookie('hbs-token');

  const { selectedIntegration } = useIntegrationContext();

  const toast = useToastService();

  useEffect(() => {
    if (!selectedIntegration) return;

    const fetchBookings = async (
      status: string,
      setBookings: (bookings: Booking[]) => void,
      setArr: (arr: boolean[]) => void,
      type: keyof typeof loading
    ) => {
      setLoading((prev) => ({ ...prev, [type]: true }));
      try {
        const rs = await BookingService.get(
          { status, next: false },
          token,
          selectedIntegration.name
        );

        if (Array.isArray(rs) && rs.length === 0) {
          toast.info(`No ${status} bookings`);
        }

        if ('error' in rs) {
          throw Error(rs.error as string);
        }

        setBookings(rs);

        setArr(new Array(rs.length).fill(false));
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('An unknown error occurred');
        }
        console.error(error);
      } finally {
        setLoading((prev) => ({ ...prev, [type]: false }));
      }
    };

    fetchBookings('new', setNewBookings, setNewArr, 'new');
    fetchBookings('change', setChangedBookings, setChangeArr, 'change');
    fetchBookings('cancel', setCancelBookings, setCancelArr, 'cancel');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, selectedIntegration, token]);

  const changeHandler = (index: number, type: 'new' | 'change' | 'cancel') => {
    if (isDisabled) setIsDisabled(false);
    const setArr = {
      new: setNewArr,
      change: setChangeArr,
      cancel: setCancelArr,
    }[type];
    const arr = { new: newArr, change: changeArr, cancel: cancelArr }[type];
    setArr(arr.map((el, i) => (i === index ? !el : el)));
  };

  const selectAll = (action: 'select' | 'deselect', type: 'new' | 'change' | 'cancel') => {
    if (isDisabled) setIsDisabled(false);
    const setArr = {
      new: setNewArr,
      change: setChangeArr,
      cancel: setCancelArr,
    }[type];
    const arr = { new: newArr, change: changeArr, cancel: cancelArr }[type];
    setArr(arr.map(() => action === 'select'));
  };

  const submitHandler = async (type: 'new' | 'change' | 'cancel') => {
    if (!selectedIntegration) {
      toast.error('Please select an integration');
      return;
    }

    setIsDisabled(true);
    const arr = { new: newArr, change: changeArr, cancel: cancelArr }[type];
    const bookings = {
      new: newBookings,
      change: changedBookings,
      cancel: cancelBookings,
    }[type];
    const sendArr = arr
      .map((el, i) => (el ? bookings[i] : null))
      .filter((booking): booking is Booking => booking !== null);

    try {
      const rs = await BookingService.send(sendArr, token, selectedIntegration.name, type);
      const { errors, sended, confirmed, cancelled } = rs as ResultSendBookings;

      if (errors) {
        toast.error(
          `Error: ${errors} bookings not sent, ${rs.notConfirmed} bookings not confirmed`
        );
      }
      toast.info(`Sent: ${sended}, confirmed: ${confirmed}, cancelled: ${cancelled}`);
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      console.error(err);
    } finally {
      setTimeout(() => setRefresh((prev) => prev + 1), 5000);
    }
  };

  if (!selectedIntegration) {
    return <h2 style={{ textAlign: 'center' }}>please select an integration</h2>;
  }

  return (
    <View paddingInline={4}>
      <Helmet>
        <title>HBS - Bookings window</title>
      </Helmet>
      <View gap={4}>
        <View direction="row" gap={3} align="center">
          <Text variant="featured-2">Interlook bookings state</Text>
          <Button
            onClick={() => setRefresh((prev) => prev + 1)}
            disabled={Object.values(loading).some((l) => l)}
            icon={RefreshCw}
            color="primary"
            variant="ghost"
            size="small"
          />
        </View>
        <BookingSection
          title="New"
          bookings={newBookings}
          loading={loading.new}
          arr={newArr}
          onChange={(index) => changeHandler(index, 'new')}
          onSelectAll={(action) => selectAll(action, 'new')}
          onSubmit={() => submitHandler('new')}
          isDisabled={isDisabled}
        />
        <BookingSection
          title="Changed"
          bookings={changedBookings}
          loading={loading.change}
          arr={changeArr}
          onChange={(index) => changeHandler(index, 'change')}
          onSelectAll={(action) => selectAll(action, 'change')}
          onSubmit={() => submitHandler('change')}
          isDisabled={isDisabled}
        />
        <BookingSection
          title="Canceled"
          bookings={cancelBookings}
          loading={loading.cancel}
          arr={cancelArr}
          onChange={(index) => changeHandler(index, 'cancel')}
          onSelectAll={(action) => selectAll(action, 'cancel')}
          onSubmit={() => submitHandler('cancel')}
          isDisabled={isDisabled}
        />
      </View>
    </View>
  );
};

export default GetBookings;
