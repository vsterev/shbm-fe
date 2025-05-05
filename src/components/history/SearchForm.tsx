import { Dispatch, SetStateAction, FormEventHandler, useEffect } from "react";
import appCookie from "../../utils/appCookie";
import {
  Booking,
  SearchBookingsParams,
} from "../../interfaces/booking.interface";
import BookingService from "../../services/booking";
import {
  Button,
  FormControl,
  Radio,
  RadioGroup,
  TextField,
  View,
} from "reshaped";

interface HistorySearchFormProps {
  params: SearchBookingsParams;
  setParams: Dispatch<SetStateAction<SearchBookingsParams>>;
  setBookingsArr: Dispatch<SetStateAction<Booking[]>>;
  setCount: Dispatch<SetStateAction<number>>;
}

const HistorySearchForm = ({
  params,
  setParams,
  setBookingsArr,
  setCount,
}: HistorySearchFormProps) => {
  const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await searchResult();
  };

  useEffect(() => {
    if (!params.skip) return;
    searchResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.skip]);

  const searchResult = async () => {
    const token = appCookie("hbs-token");

    await BookingService.search(params, token).then((res) => {
      setBookingsArr(res.bookings);
      setCount(res.count);
    });
  };

  // const buttonDisabled = () => {
  //     const isDisabled = Object.values(params).reduce((sum, el) => sum + el.length, 0) === 0
  //     return isDisabled || params.booking.length < 6;
  // }
  return (
    <View>
      <form onSubmit={submitHandler}>
        <FormControl group>
          <RadioGroup
            name="isByDate"
            onChange={(e) =>
              setParams({ ...params, isCreateDate: e.value === "yes" })
            }
          >
            <View direction="row" width={118} gap={5} justify="end">
              <Radio
                value="yes"
                checked={params.isCreateDate === true}
                onChange={() => setParams({ ...params, isCreateDate: true })}
              >
                by date send to parsers
              </Radio>
              <Radio
                value="name"
                checked={params.isCreateDate === false}
                onChange={() => setParams({ ...params, isCreateDate: false })}
              >
                by check-in
              </Radio>
            </View>
          </RadioGroup>
        </FormControl>
        <View direction="row" gap={2} align="end">
          <FormControl>
            <FormControl.Label>booking</FormControl.Label>
            <TextField
              name="booking"
              id="booking"
              value={params.booking}
              onChange={(e) => setParams({ ...params, booking: e.value })}
              size="small"
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>from</FormControl.Label>
            <input
              type="date"
              name="dateFrom"
              id="dateFrom"
              value={params.dateFrom}
              onChange={(e) =>
                setParams({ ...params, dateFrom: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>to</FormControl.Label>
            <input
              type="date"
              name="dateTo"
              id="dateTo"
              value={params.dateTo}
              onChange={(e) => setParams({ ...params, dateTo: e.target.value })}
            />
          </FormControl>
          <Button
            variant="solid"
            color="primary"
            type="submit"
            size="small"
            disabled={!(params?.dateFrom || params?.dateTo || params?.booking)}
          >
            submit
          </Button>
        </View>
      </form>
    </View>
  );
};
export default HistorySearchForm;
