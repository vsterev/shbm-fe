import { View, FormControl, TextField, Button, Text } from 'reshaped';
import { Integration } from '../../contexts/integration.context';
import HotelService from '../../services/hotel';
import { HotelInterlook } from '../../interfaces/hotel.interface';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

interface SearchIntrlookHotelProps {
  selectedIntegration: Integration;
  token: string;
  setHotelProps: React.Dispatch<React.SetStateAction<HotelInterlook[]>>;
  strSearchHotel: string;
  setStrSearchHotel: React.Dispatch<React.SetStateAction<string>>;
}

const SearchIntrlookHotel = ({
  selectedIntegration,
  token,
  setHotelProps,
  strSearchHotel,
}: SearchIntrlookHotelProps) => {
  const SearchHotelSchema = z.object({
    hotelName: z.string().min(1, 'Hotel name is required'),
  });

  type SearchHotelSchemaType = z.infer<typeof SearchHotelSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchHotelSchemaType>({
    resolver: zodResolver(SearchHotelSchema),
    defaultValues: {
      hotelName: strSearchHotel || '',
    },
  });

  useEffect(() => {
    reset({ hotelName: strSearchHotel || '' });
  }, [strSearchHotel, reset]);

  const submitHandler = async (data: SearchHotelSchemaType) => {
    console.log(data);
    try {
      const result = await HotelService.get(
        {
          hotelName: data.hotelName.toLowerCase(),
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
      <Text variant="featured-2">Coresponding hotel in Interlook</Text>
      <form onSubmit={handleSubmit(submitHandler)}>
        <View direction="row" gap={2}>
          <FormControl required>
            <Controller
              control={control}
              name="hotelName"
              render={({ field }) => (
                <TextField
                  value={field.value}
                  name={field.name}
                  onChange={({ event }) => field.onChange(event)}
                />
              )}
            />
            <FormControl.Error>{errors?.hotelName?.message}</FormControl.Error>
          </FormControl>
          <Button type="submit" disabled={strSearchHotel.length === 0} color="primary">
            search
          </Button>
        </View>
      </form>
    </View>
  );
};
export default SearchIntrlookHotel;
