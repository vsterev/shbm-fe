import { useState } from "react";
import IntegrationHotelsInfo from "../components/accommodationsMap/IntegrationHotelsInfo";
import HotelInterlookInfo from "../components/accommodationsMap/HotelInterlookInfo";
import HotelSelect from "../components/accommodationsMap/HotelSelect";
import { Helmet } from "react-helmet-async";
import { HotelInterlook } from "../interfaces/hotel.interface";
import { useIntegrationContext } from "../contexts/integration.context";
import IntegrationAlert from "../components/shared/integrationAlert";
import { View, Text } from "reshaped";

const HotelPropertiesMap = () => {
  const [selectedHotelId, setSelectedHotelId] = useState<number | undefined>(
    undefined,
  );
  const [mappedHotels, setMappedHotels] = useState<HotelInterlook[]>([]);
  const { selectedIntegration } = useIntegrationContext();

  if (!selectedIntegration) {
    return (
      <IntegrationAlert
        title="Select an integration"
        message=" To view all hotels in integration system, please select first
    integration from dropdown"
      />
    );
  }
  return (
    <View gap={2} padding={4}>
      <Helmet>
        <title>HBS - accommodation mapping tables</title>
      </Helmet>
      <Text variant="featured-2">Accommodations mappings</Text>
      <HotelSelect
        selectedHotelId={selectedHotelId}
        setSelectedHotelId={setSelectedHotelId}
        mappedHotels={mappedHotels}
        setMappedHotels={setMappedHotels}
      />
      <IntegrationHotelsInfo
        selectedHotelId={selectedHotelId}
        mappedHotels={mappedHotels}
      />
      <HotelInterlookInfo selectedHotelId={selectedHotelId} />
    </View>
  );
};
export default HotelPropertiesMap;
