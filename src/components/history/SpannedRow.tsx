import { HotelServiceBooking } from "../../interfaces/booking.interface";
import { View } from "reshaped";

interface SpannedRowProps {
  hotelServices: HotelServiceBooking[];
  item: keyof HotelServiceBooking;
  subItem?: keyof HotelServiceBooking;
}

const SpannedRow = ({ hotelServices, item, subItem }: SpannedRowProps) => {
  return (
    <>
      {hotelServices.map((hts, index) => (
        <View key={index}>
          {Array.isArray(hts[item])
            ? item === "tourists" &&
              hts[item].map((tourist, touristIndex) => {
                return (
                  <View key={touristIndex}>
                    {tourist.sex}, {tourist.name},{" "}
                    {tourist.birthDate?.substring(0, 10)}
                  </View>
                );
              }) // Convert arrays to a string representation
            : typeof hts[item] === "object" && hts[item] !== null
              ? JSON.stringify(hts[item]) // Convert objects to a string representation
              : String(hts[item]) +
                (subItem && hts[subItem] ? ` -  ${String(hts[subItem])}` : "")}
          {hotelServices.length > index + 1 && <hr style={{ margin: "5px" }} />}
        </View>
      ))}
    </>
  );
};

export default SpannedRow;
