import { useState, useEffect } from "react";
import appCookie from "../../utils/appCookie";
import styles from "../styles/AccommodationsMap.module.css";
import { HotelInterlook } from "../../interfaces/hotel.interface";
import { useIntegrationContext } from "../../contexts/integration.context";
import ReactLoading from "react-loading";
import IntegrationService from "../../services/integration";

interface HotelParserInfoProps {
  selectedHotelId: number | undefined;
  mappedHotels: HotelInterlook[];
}

const IntegrationHotelsInfo = ({
  selectedHotelId,
  mappedHotels,
}: HotelParserInfoProps) => {
  const [activeHotelName, setActiveHotelName] = useState<string>("");
  const token = appCookie("hbs-token");
  const [integrationHotelProperties, setIntegrationHotelProperties] = useState<
    { rooms: string[]; boards: string[] } | undefined
  >(undefined);

  const { selectedIntegration } = useIntegrationContext();

  useEffect(() => {
    if (!selectedIntegration) {
      return;
    }
    setIntegrationHotelProperties(undefined);

    if (selectedHotelId) {
      const integrationHotels = mappedHotels?.find(
        (el) => el._id === selectedHotelId,
      );
      setActiveHotelName(integrationHotels?.name || "");
      const integrationHotelCode = Number(
        integrationHotels?.integrationSettings?.hotelCode,
      );

      IntegrationService.getAccommodations(
        integrationHotelCode,
        selectedIntegration.name,
        token,
      )
        .then((r) => {
          if (!r) {
            return;
          }
          setIntegrationHotelProperties(r);
        })
        .catch(console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotelId]);

  if (!selectedHotelId) {
    return "Please select hotel";
  }

  if (!integrationHotelProperties) {
    return (
      <ReactLoading type="bubbles" color="blue" height={100} width={100} />
    );
  }

  return (
    <div className={styles.accomElements}>
      <h3>
        hotel {selectedIntegration?.displayName} information for{" "}
        {activeHotelName}{" "}
      </h3>
      <h4> boards: </h4>
      {!!integrationHotelProperties &&
        integrationHotelProperties.boards?.map((el, i) => {
          return <input type="text" key={i} value={el} disabled />;
        })}
      <h4>rooms: </h4>
      {!!integrationHotelProperties &&
        integrationHotelProperties.rooms?.map((el, i) => {
          return (
            <input
              type="text"
              key={i}
              value={el || ""}
              disabled
              style={{ width: "23%" }}
            />
          );
        })}
    </div>
  );
};
export default IntegrationHotelsInfo;
