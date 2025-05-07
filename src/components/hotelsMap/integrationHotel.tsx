import { View, Text, Button, Divider } from 'reshaped';
import { Integration } from '../../contexts/integration.context';
import { HotelInterlook, IntegratedHotelResponse } from '../../interfaces/hotel.interface';
import React from 'react';
import HotelService from '../../services/hotel';

interface IntegratedHotelProps {
  selectedIntegration: Integration;
  token: string;
  refreshAfterMap: boolean;
  setStrSearchHotel: React.Dispatch<React.SetStateAction<string>>;
  setHotelProps: React.Dispatch<React.SetStateAction<HotelInterlook[]>>;
  hotels:
    | {
        integratedHotels: IntegratedHotelResponse[];
        interLookHotels: number[];
      }
    | undefined;
  setHotels: React.Dispatch<
    React.SetStateAction<
      | {
          integratedHotels: IntegratedHotelResponse[];
          interLookHotels: number[];
        }
      | undefined
    >
  >;
}

const IntegrationHotelMap = ({
  selectedIntegration,
  token,
  setStrSearchHotel,
  setHotelProps,
  hotels,
}: IntegratedHotelProps) => {
  const hotelNameCheck = (hotelName: string) => {
    if (hotelName.includes('#')) {
      const regex = /(?<=#).*$/gm;
      const match = regex.exec(hotelName);
      return match ? match[0] : '';
    }
    return hotelName;
  };

  const clickHandler = async (b: IntegratedHotelResponse) => {
    if (!selectedIntegration?.name) {
      return;
    }
    setHotelProps([]);
    const hotelNameChecked = hotelNameCheck(b.hotelName);
    setStrSearchHotel(hotelNameChecked);

    try {
      const result = await HotelService.get(
        {
          hotelName: hotelNameChecked.toLowerCase(),
          integrationName: selectedIntegration.name,
        },
        token
      );
      setHotelProps(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View gap={2}>
      <Text variant="featured-2">{selectedIntegration?.displayName} hotels listing</Text>
      <View gap={2} direction="row">
        {hotels?.integratedHotels?.map((el) => {
          return (
            <Button
              size="small"
              variant="solid"
              color={el.mapped ? 'positive' : 'critical'}
              onClick={() => clickHandler(el)}
              key={el.hotelId}
            >
              {el.hotelName}
              <Divider vertical />
              {el.hotelId}
            </Button>
          );
        })}
        <Divider />
      </View>
    </View>
  );
};
export default IntegrationHotelMap;
