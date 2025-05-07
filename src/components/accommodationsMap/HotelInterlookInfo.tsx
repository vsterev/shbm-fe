import React, { useState, useEffect, useMemo } from 'react';
import HotelCreateVariant from './HotelCreateVariant';
import appCookie from '../../utils/appCookie';
import { AccommodationMapping } from '../../interfaces/hotel.interface';
import { useIntegrationContext } from '../../contexts/integration.context';
import AccommodationService from '../../services/accommodation';
import { View, Text, TextField, Button, Card, useToggle, Loader } from 'reshaped';
import DeleteAlert from '../shared/DeleteAlert';
import useToastService from '../../utils/toastService';

interface HotelInfoProps {
  selectedHotelId: number | undefined;
}

const HotelInfo = ({ selectedHotelId }: HotelInfoProps) => {
  const token = appCookie('hbs-token');

  const [accommodationsMap, setAccommodationsMap] = useState<AccommodationMapping>(
    {} as AccommodationMapping
  );
  const [refresh, setRefresh] = useState<boolean>(false);

  const { selectedIntegration } = useIntegrationContext();

  const toast = useToastService();

  useEffect(() => {
    if (!selectedHotelId) {
      return;
    }
    if (!selectedIntegration) {
      return;
    }
    setAccommodationsMap({} as AccommodationMapping);
    AccommodationService.get(
      { ilCode: selectedHotelId, integrationName: selectedIntegration.name },
      token
    )
      .then((r) => {
        if ('error' in r) {
          return;
        }
        setAccommodationsMap(r);
        setRefresh(false);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHotelId, refresh]);

  const changeHandler = (
    e: {
      name: string;
      value: string;
      event?: React.ChangeEvent<HTMLInputElement> | undefined;
    },
    el: number | string
  ) => {
    if (!selectedIntegration) {
      return;
    }
    const { name, value } = e;
    const typedName = name as 'rooms' | 'boards';
    const index = name === 'boards' ? Number(el) : String(el);

    // Create a copy of the accommodationsMap for the specific type (boards or rooms)
    const temp = { ...accommodationsMap[typedName] };

    // Ensure temp[index] exists
    if (!temp[index]) {
      temp[index] = {} as (typeof temp)[keyof typeof temp];
    }

    temp[index].integrationCode = value;

    setAccommodationsMap({ ...accommodationsMap, [name]: temp });
  };
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedIntegration) {
      return;
    }

    await AccommodationService.edit(
      {
        hotelId: accommodationsMap._id,
        boards: accommodationsMap.boards,
        rooms: accommodationsMap.rooms,
        integrationName: selectedIntegration.name,
      },
      token
    )
      .then(() => {
        toast.success('Mapping was saved');
      })
      .catch((error) => console.log(error));
  };

  const deleteHandler = async () => {
    await AccommodationService.delete(accommodationsMap?._id, token).then(() => {
      setAccommodationsMap(() => ({}) as AccommodationMapping);
    });
  };

  const activateCreateVariants = useMemo(() => {
    return !Object.keys(accommodationsMap).length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accommodationsMap, selectedHotelId]);

  const {
    active: activeDelete,
    activate: activateDelete,
    deactivate: deactivateDelete,
  } = useToggle(false);

  if (!selectedHotelId) {
    return null;
  }

  if (!accommodationsMap) {
    return (
      <View width="100&" align="center">
        <Loader size="large" />
      </View>
    );
  }

  if (!selectedIntegration) {
    return null;
  }

  return (
    <Card>
      <View backgroundColor="neutral" padding={2} borderRadius="medium">
        <Text variant="body-1">
          Interlook information and mappings for {accommodationsMap.hotelName}:
        </Text>
      </View>
      {activateCreateVariants ? (
        <HotelCreateVariant selectedHotelId={selectedHotelId} setRefresh={setRefresh} />
      ) : (
        <View gap={2}>
          <form onSubmit={submitHandler}>
            <View direction="row" width="60%" align="start" justify="space-between">
              <View gap={2}>
                <Text variant="body-3">boards:</Text>
                {accommodationsMap?.boards &&
                  Object.keys(accommodationsMap?.boards).map((boardCode: string) => {
                    return (
                      <View key={boardCode} gap={3} direction="row" align="center">
                        <Text variant="body-3">
                          {accommodationsMap?.boards[Number(boardCode)]?.boardId},{' '}
                          {accommodationsMap?.boards[Number(boardCode)]?.boardName}{' '}
                        </Text>
                        <TextField
                          value={accommodationsMap?.boards[Number(boardCode)].integrationCode || ''}
                          name="boards"
                          onChange={(e) => changeHandler(e, boardCode)}
                        />
                      </View>
                    );
                  })}
              </View>
              <View gap={2}>
                <Text variant="body-3">rooms:</Text>
                {accommodationsMap?.rooms &&
                  Object.keys(accommodationsMap?.rooms).map((el) => {
                    return (
                      <View key={el} gap={3} direction="row" align="center">
                        <Text variant="body-3">
                          {el}, {accommodationsMap.rooms[el].roomTypeName}{' '}
                          {accommodationsMap.rooms[el].roomCategoryName}
                        </Text>
                        <View width={90}>
                          <TextField
                            value={accommodationsMap.rooms[el]?.integrationCode}
                            name="rooms"
                            onChange={(e) => changeHandler(e, el)}
                          />
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
            <View direction="row" gap={2} justify="center" paddingTop={2}>
              <Button type="submit" variant="solid" color="primary">
                Submit
              </Button>
              <Button
                variant="solid"
                color="critical"
                onClick={() => {
                  activateDelete();
                }}
              >
                Delete
              </Button>
            </View>
          </form>
        </View>
      )}
      {activeDelete && (
        <DeleteAlert
          deleteFunction={deleteHandler}
          deactivate={deactivateDelete}
          active={activeDelete}
        />
      )}
    </Card>
  );
};

export default HotelInfo;
