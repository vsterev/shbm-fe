import { Button, Checkbox, Loader, Text, View } from "reshaped";
import { Booking } from "../../interfaces/booking.interface";

const BookingSection = ({
  title,
  bookings,
  loading,
  arr,
  onChange,
  onSelectAll,
  onSubmit,
  isDisabled,
}: {
  title: string;
  bookings: Booking[];
  loading: boolean;
  arr: boolean[];
  onChange: (index: number) => void;
  onSelectAll: (action: "select" | "deselect") => void;
  onSubmit: () => void;
  isDisabled: boolean;
}) => {
  return (
    <View>
      <Text variant="body-2">{title}</Text>
      <View gap={2}>
        {!!bookings.length && (
          <View direction="row" gap={2} align="center">
            <Button
              variant="outline"
              color="primary"
              onClick={() => onSelectAll("select")}
              size="small"
            >
              select all
            </Button>
            <Button
              variant="outline"
              color="primary"
              onClick={() => onSelectAll("deselect")}
              size="small"
            >
              deselect all
            </Button>
          </View>
        )}
        {loading ? (
          <Loader size="medium" />
        ) : (
          bookings.map((el, index) => (
            <View key={el.bookingId} direction="row" gap={2}>
              <Checkbox
                checked={arr[index] || false}
                onChange={() => onChange(index)}
                name="checkbox"
              />
              <b>{" " + el.bookingName}</b>, {el.hotelServices[0].hotel},{" "}
              {el.hotelServices[0].checkIn.substring(0, 10)},{" "}
              {el.hotelServices[0].checkOut.substring(0, 10)},
              {el.hotelServices[0].roomAccommodation},{" "}
              {el.hotelServices[0].roomType}-{el.hotelServices[0].roomCategory},{" "}
              {el.hotelServices[0].pansion}
            </View>
          ))
        )}
        {bookings.length ? (
          <View>
            <Button
              variant="solid"
              color="primary"
              size="small"
              onClick={onSubmit}
              disabled={arr.every((el) => !el) || isDisabled}
            >
              send
            </Button>
          </View>
        ) : (
          "0 bookings"
        )}
      </View>
    </View>
  );
};
export default BookingSection;
