import { Dispatch, SetStateAction, useEffect } from "react";
import appCookie from "../../utils/appCookie";
// import UserContext from '../../utils/userContext';
import { HotelInterlook } from "../../interfaces/hotel.interface";
import HotelService from "../../services/hotel";
import { useIntegrationContext } from "../../contexts/integration.context";
import { FormControl, Loader, Select, View } from "reshaped";

interface HotelSelectProps {
  selectedHotelId: number | undefined;
  setSelectedHotelId: Dispatch<SetStateAction<number | undefined>>;
  mappedHotels: HotelInterlook[];
  setMappedHotels: Dispatch<SetStateAction<HotelInterlook[]>>;
}

function HotelSelect({
  setSelectedHotelId,
  mappedHotels,
  setMappedHotels,
}: HotelSelectProps) {
  // const { logOut } = useContext(UserContext)
  const { selectedIntegration } = useIntegrationContext();

  const getParserHotels = () => {
    if (!selectedIntegration) {
      return;
    }
    setSelectedHotelId(undefined);
    const token = appCookie("hbs-token");
    return HotelService.getMapped(token, selectedIntegration.name)
      .then((hotels) => {
        // if (hotels.msg) {
        //   logOut();
        // }
        setMappedHotels(hotels);
      })
      .catch(() => console.log("Error fetching mapped hotels!"));
  };

  useEffect(() => {
    getParserHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIntegration?.code]);

  const changeHandler = (e: { value: string }) => {
    setSelectedHotelId(e.value ? +e.value : undefined);
  };

  return (
    <View>
      {!mappedHotels ? (
        <View width="100%" align="center">
          <Loader size="large" />
        </View>
      ) : (
        <FormControl>
          <View direction="column" width={100}>
            <Select
              name="mappedHotels"
              placeholder="Select a hotel"
              onChange={changeHandler}
              options={mappedHotels.map((hotel) => ({
                label: hotel.name,
                value: hotel._id.toString(),
              }))}
            />
          </View>
        </FormControl>
      )}
    </View>
  );
}
export default HotelSelect;
