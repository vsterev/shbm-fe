import React, { Dispatch, SetStateAction, useState } from "react";
import appCookie from "../../utils/appCookie";
import { useIntegrationContext } from "../../contexts/integration.context";
import AccommodationService from "../../services/accommodation";
import { Button, Loader, View, Text, Calendar } from "reshaped";
import useToastService from "../../utils/toastService";

interface HotelCreateVariantProps {
  selectedHotelId: number | undefined;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const HotelCreateVariant = ({
  selectedHotelId,
  setRefresh,
}: HotelCreateVariantProps) => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const token = appCookie("hbs-token");
  const [loader, setLoader] = useState(false);

  const { selectedIntegration } = useIntegrationContext();

  const toast = useToastService();

  const submitHandler = async (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => {
    if (!selectedHotelId || !selectedIntegration) {
      return;
    }
    e.preventDefault();
    setLoader(true);
    const accommodations = await AccommodationService.create(
      {
        ilCode: selectedHotelId,
        checkIn: dateFrom,
        checkOut: dateTo,
        integrationName: selectedIntegration.name,
      },
      token,
    ).finally(() => {
      setLoader(false);
    });

    if (accommodations?.error) {
      toast.error(accommodations.error);
      return;
    } else {
      setRefresh(true);
    }
  };

  // @ts-ignore
  const calendarHandler = (args) => {
    const { start, end } = args.value;
    if (start && end) {
      setDateFrom(start.toISOString().split("T")[0]);
      setDateTo(end.toISOString().split("T")[0]);
    }
  };

  return (
    <View gap={2}>
      <Text variant="body-1">
        Boards and accommodations are not synchronized. Please select a period
        to fetch available accommodations.
      </Text>
      {loader ? (
        <View width="canter" align="center">
          <Loader size="large" />
        </View>
      ) : (
        <>
          <View width={100} align="center" gap={2}>
            <Calendar range onChange={calendarHandler} />
            <Button
              onClick={submitHandler}
              variant="solid"
              color="primary"
              fullWidth
            >
              create variant
            </Button>
          </View>
        </>
      )}
    </View>
  );
};
export default HotelCreateVariant;
