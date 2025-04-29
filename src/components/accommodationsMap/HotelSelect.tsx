import { Dispatch, SetStateAction, useEffect } from "react";
import appCookie from "../../utils/appCookie";
// import UserContext from '../../utils/userContext';
import styles from "../styles/AccommodationsMap.module.css";
import { HotelInterlook } from "../../interfaces/hotel.interface";
import HotelService from "../../services/hotel";
import { useIntegrationContext } from "../../contexts/integration.context";
import ReactLoading from "react-loading";

interface HotelSelectProps {
  selectedHotelId: number | undefined;
  setSelectedHotelId: Dispatch<SetStateAction<number | undefined>>;
  mappedHotels: HotelInterlook[];
  setMappedHotels: Dispatch<SetStateAction<HotelInterlook[]>>;
}

function HotelSelect({
  selectedHotelId,
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

  const changeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHotelId(e.target.value ? +e.target.value : undefined);
  };

  return (
    <>
      <div className={styles.accomElements}>
        <div>
          Select mapped hotel from {selectedIntegration?.displayName}{" "}
          integration
        </div>
        <div>
          {!mappedHotels ? (
            <ReactLoading
              type="bubbles"
              color="blue"
              height={100}
              width={100}
            />
          ) : (
            <select
              id="select"
              value={selectedHotelId}
              onChange={changeHandler}
            >
              {!selectedHotelId && <option value="">choose a hotel</option>}
              {Array.isArray(mappedHotels) &&
                mappedHotels?.map((el) => {
                  return (
                    <option key={el._id} value={el._id}>
                      {el.name}
                    </option>
                  );
                })}
            </select>
          )}
        </div>
      </div>
    </>
  );
}
export default HotelSelect;
