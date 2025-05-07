import { useState, useEffect } from 'react';
import appCookie from '../../utils/appCookie';
import { HotelInterlook } from '../../interfaces/hotel.interface';
import { useIntegrationContext } from '../../contexts/integration.context';
import IntegrationService from '../../services/integration';
import { View, Text, Loader, Card } from 'reshaped';
import IntegrationAlert from '../shared/integrationAlert';

interface HotelParserInfoProps {
  selectedHotelId: number | undefined;
  mappedHotels: HotelInterlook[];
}

const IntegrationHotelsInfo = ({ selectedHotelId, mappedHotels }: HotelParserInfoProps) => {
  const token = appCookie('hbs-token');
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
      const integrationHotels = mappedHotels?.find((el) => el._id === selectedHotelId);
      const integrationHotelCode = Number(integrationHotels?.integrationSettings?.hotelCode);

      IntegrationService.getAccommodations(integrationHotelCode, selectedIntegration.name, token)
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
    return (
      <IntegrationAlert
        title="Select a hotel"
        message=" To view all mappings please select hotel from dropdown"
      />
    );
  }

  if (!integrationHotelProperties) {
    return (
      <View width="100%" align="center">
        <Loader size="large" />
      </View>
    );
  }

  return (
    <Card>
      <View backgroundColor="neutral" padding={2} borderRadius="medium">
        <Text variant="body-1">Integration hotel properties</Text>
      </View>
      <Text variant="body-3"> boards: </Text>
      <View direction="row" gap={2} wrap>
        {!!integrationHotelProperties &&
          integrationHotelProperties.boards?.map((el, i) => {
            return <input type="text" key={i} value={el} disabled />;
          })}
      </View>
      <Text variant="body-3">rooms: </Text>
      <View direction="row" gap={2} wrap>
        {!!integrationHotelProperties &&
          integrationHotelProperties.rooms?.map((el, i) => {
            return <input type="text" key={i} value={el || ''} disabled style={{ width: '23%' }} />;
          })}
      </View>
    </Card>
  );
};
export default IntegrationHotelsInfo;
