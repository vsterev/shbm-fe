import { View, FormControl, TextField, Button, Text } from 'reshaped';
import { HotelInterlook } from '../../interfaces/hotel.interface';
import { Integration } from '../../contexts/integration.context';
import { ChangeEvent } from 'react';
import useToastService from '../../utils/toastService';
import HotelService from '../../services/hotel';

interface InterlookHotelMapProps {
  hotelProps: HotelInterlook[];
  selectedIntegration: Integration | undefined;
  token: string;
  setHotelProps: React.Dispatch<React.SetStateAction<HotelInterlook[]>>;
  setRefreshAfterMap: React.Dispatch<React.SetStateAction<boolean>>;
  setDeleteHotelMap: React.Dispatch<React.SetStateAction<HotelInterlook | undefined>>;
  activateDelete: () => void;
}

const InterlookHotelMap = ({
  hotelProps,
  setHotelProps,
  selectedIntegration,
  setDeleteHotelMap,
  token,
  setRefreshAfterMap,
  activateDelete,
}: InterlookHotelMapProps) => {
  const toast = useToastService();

  const changeHandler = (
    e: {
      name?: string;
      value: string;
      event?: ChangeEvent<HTMLInputElement> | undefined;
    },
    itm: HotelInterlook
  ) => {
    const { value } = e;

    const index = hotelProps.findIndex((el) => el._id === itm._id);

    const tempArr: HotelInterlook[] = [...hotelProps];

    if (index !== -1) {
      // tempArr[index][name as keyof HotelInterlook] = value as never;
      if (!tempArr[index].integrationSettings) {
        tempArr[index].integrationSettings = {
          hotelId: value,
          apiName: selectedIntegration?.name || '', // Provide a default or appropriate value for apiName
        };
      }
      tempArr[index].integrationSettings.hotelId = value as never;
    }

    setHotelProps(tempArr);
  };

  const mapHandler = async (
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>,
    el: HotelInterlook
  ) => {
    e.preventDefault();
    if (!selectedIntegration?.code) {
      window.alert(
        'Not empty string is allowed, please fill integration code or delete all mappings for this hotel'
      );
      return;
    }

    const result = await HotelService.edit(
      {
        integrationName: selectedIntegration.name,
        integrationValue: Number(el.integrationSettings?.hotelId),
        hotelId: +el._id,
        // [selectedIntegration?.code]: +(el[selectedIntegration?.code as keyof HotelInterlook] || 0)
      },
      token
    )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setRefreshAfterMap((prev) => !prev));

    if (result && 'message' in result) {
      toast.error(result.message);
      setHotelProps([]);
      setRefreshAfterMap(false);
      return;
    }
  };

  return (
    <View gap={2}>
      <Text variant="featured-2">
        Map Interlook hotel names to their corresponding integration hotel names
      </Text>

      <form>
        {hotelProps.length > 0 ? (
          <View gap={2}>
            {hotelProps.map((el, i) => {
              const integrationCode = selectedIntegration?.code;
              return (
                <View gap={5} key={el._id} direction="row">
                  <View key={el._id} direction="row" align="center">
                    <Text variant="body-1">
                      {i + 1}, {el.name}
                      {' - '}
                      {el.resort}
                      {' | '}
                      {el._id}
                    </Text>
                  </View>
                  <View gap={2} direction="row" align="center">
                    <FormControl>
                      <View direction="row" gap={2} align="center">
                        <FormControl.Label>integration code</FormControl.Label>
                        <TextField
                          value={el.integrationSettings?.hotelId || ''}
                          onChange={(e) => changeHandler(e, el)}
                          name={integrationCode as string}
                        />
                      </View>
                    </FormControl>
                    <Button
                      variant="solid"
                      color="positive"
                      onClick={(e) => mapHandler(e, el)}
                      disabled={!el.integrationSettings?.hotelId}
                    >
                      map it
                    </Button>
                    <Button
                      variant="solid"
                      color="critical"
                      onClick={() => {
                        setDeleteHotelMap(el);
                        activateDelete();
                      }}
                      disabled={!el.integrationSettings?.hotelId}
                    >
                      delete
                    </Button>
                  </View>
                </View>
              );
            })}
            <i>
              ** The hotel will not be displayed if it has already been matched to another
              integration manager.
            </i>
          </View>
        ) : (
          'please select a hotel or refine the search to display hotels mapping list'
        )}
      </form>
    </View>
  );
};
export default InterlookHotelMap;
