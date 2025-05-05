import {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import appCookie from "../utils/appCookie";
import { Helmet } from "react-helmet-async";
import {
  HotelInterlook,
  IntegratedHotelResponse,
} from "../interfaces/hotel.interface";
import HotelService from "../services/hotel";
import { useIntegrationContext } from "../contexts/integration.context";
import {
  Button,
  Divider,
  FormControl,
  Loader,
  Text,
  TextField,
  useToggle,
  View,
} from "reshaped";
import IntegrationAlert from "../components/shared/integrationAlert";
import DeleteAlert from "../components/shared/DeleteAlert";
import useToastService from "../utils/toastService";

const HotelMap = () => {
  const { selectedIntegration } = useIntegrationContext();
  const [hotels, setHotels] = useState<
    | { integratedHotels: IntegratedHotelResponse[]; interLookHotels: number[] }
    | undefined
  >(undefined);
  const [strSearchHotel, setStrSearchHotel] = useState<string>("");
  const [hotelProps, setHotelProps] = useState<HotelInterlook[]>([]);
  const [refreshAfterMap, setRefreshAfterMap] = useState<boolean>(false);
  const [deleteHotelMap, setDeleteHotelMap] = useState<
    HotelInterlook | undefined
  >(undefined);
  const token = appCookie("hbs-token");
  // const { logOut } = useContext(UserContext)
  const {
    active: activeDelete,
    activate: activateDelete,
    deactivate: deactivateDelete,
  } = useToggle(false);

  const toast = useToastService();

  useEffect(() => {
    if (!selectedIntegration) {
      return;
    }
    // clear search hotel filter and empty Interlook props
    setStrSearchHotel("");
    setHotelProps([]);

    const fetchHotels = async () => {
      try {
        setHotels(undefined);
        const htls = await HotelService.getAll(token, selectedIntegration.name);
        // if (htls.msg) {
        //   logOut();
        // }
        setHotels(htls);
      } catch (error) {
        toast.error("Error fetching hotels");
        console.error(error);
      }
    };

    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIntegration, refreshAfterMap]);

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
        token,
      );
      setHotelProps(result);
    } catch (error) {
      console.log(error);
    }
  };

  async function submitSearchHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedIntegration?.name) {
      return;
    }
    try {
      const result = await HotelService.get(
        {
          hotelName: strSearchHotel,
          integrationName: selectedIntegration.name,
        },
        token,
      );
      setHotelProps(result);
    } catch (error) {
      console.log(error);
    }
  }

  const mapHandler = async (
    e:
      | KeyboardEvent<HTMLElement>
      | MouseEvent<HTMLElement, globalThis.MouseEvent>,
    el: HotelInterlook,
  ) => {
    e.preventDefault();
    if (!selectedIntegration?.code) {
      window.alert(
        "Not empty string is allowed, please fill integration code or delete all mappings for this hotel",
      );
      return;
    }

    const result = await HotelService.edit(
      {
        integrationName: selectedIntegration.name,
        integrationValue: Number(el.integrationSettings?.hotelCode),
        hotelId: +el._id,
        // [selectedIntegration?.code]: +(el[selectedIntegration?.code as keyof HotelInterlook] || 0)
      },
      token,
    )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setRefreshAfterMap((prev) => !prev));

    if (result && "message" in result) {
      toast.error(result.message);
      setHotelProps([]);
      setRefreshAfterMap(false);
      return;
    }
  };

  async function deleteHandler() {
    // e:
    //   | KeyboardEvent<HTMLElement>
    //   | MouseEvent<HTMLElement, globalThis.MouseEvent>,
    // el: HotelInterlook,
    // e.preventDefault();

    if (!deleteHotelMap || !selectedIntegration) {
      return;
    }

    // if (!deleteHotelMap.integrationSettings?.hotelCode) {
    //   window.alert("Hotel is not mapped, nothing to delete");
    //   return;
    // }

    await HotelService.delete(
      {
        hotelId: +deleteHotelMap._id,
        integrationName: selectedIntegration.name,
      },
      token,
    )
      .finally(() => setRefreshAfterMap((prev) => !prev))
      .catch(console.log);
  }

  const hotelNameCheck = (hotelName: string) => {
    if (hotelName.includes("#")) {
      const regex = /(?<=#).*$/gm;
      const match = regex.exec(hotelName);
      return match ? match[0] : "";
    }
    return hotelName;
  };

  const changeHandler = (
    e: {
      name?: string;
      value: string;
      event?: ChangeEvent<HTMLInputElement> | undefined;
    },
    itm: HotelInterlook,
  ) => {
    const { value } = e;

    const index = hotelProps.findIndex((el) => el._id === itm._id);

    const tempArr: HotelInterlook[] = [...hotelProps];

    if (index !== -1) {
      // tempArr[index][name as keyof HotelInterlook] = value as never;
      if (!tempArr[index].integrationSettings) {
        tempArr[index].integrationSettings = {
          hotelCode: value,
          apiName: selectedIntegration?.name || "", // Provide a default or appropriate value for apiName
        };
      }
      tempArr[index].integrationSettings.hotelCode = value as never;
    }

    setHotelProps(tempArr);
  };

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
    <View>
      <Helmet>
        <title>HBS - hotels mapping table</title>
      </Helmet>
      <View padding={4}>
        {selectedIntegration && !hotels ? (
          <View width="100%" justify="center" align="center">
            <Loader size="large" ariaLabel="Loading" />
          </View>
        ) : (
          <View gap={4}>
            <View gap={2}>
              <Text variant="featured-2">
                {selectedIntegration?.displayName} hotels listing
              </Text>
              <View gap={2} direction="row">
                {hotels?.integratedHotels?.map((el) => {
                  return (
                    <Button
                      size="small"
                      variant="solid"
                      color={el.mapped ? "positive" : "critical"}
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
            <View gap={2}>
              <Text variant="featured-2">Coresponding hotel in Interlook</Text>
              <form onSubmit={submitSearchHandler}>
                <View direction="row" gap={2}>
                  <FormControl required>
                    <TextField
                      name="hotelName"
                      value={strSearchHotel}
                      onChange={(e) => setStrSearchHotel(e.value)}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    disabled={strSearchHotel.length === 0}
                    color="primary"
                  >
                    search
                  </Button>
                </View>
              </form>
            </View>
            <View gap={2}>
              <Text variant="featured-2">
                Map Interlook hotel names to their corresponding integration
                hotel names
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
                              {" - "}
                              {el.resort}
                              {" | "}
                              {el._id}
                            </Text>
                          </View>
                          <View gap={2} direction="row" align="center">
                            <FormControl>
                              <View direction="row" gap={2} align="center">
                                <FormControl.Label>
                                  integration code
                                </FormControl.Label>
                                <TextField
                                  value={
                                    el.integrationSettings?.hotelCode || ""
                                  }
                                  onChange={(e) => changeHandler(e, el)}
                                  name={integrationCode as string}
                                />
                              </View>
                            </FormControl>
                            <Button
                              variant="solid"
                              color="positive"
                              onClick={(e) => mapHandler(e, el)}
                              disabled={!el.integrationSettings?.hotelCode}
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
                              disabled={!el.integrationSettings?.hotelCode}
                            >
                              delete
                            </Button>
                          </View>
                        </View>
                      );
                    })}
                    <i>
                      ** The hotel will not be displayed if it has already been
                      matched to another integration manager.
                    </i>
                  </View>
                ) : (
                  "please select a hotel or refine the search to display hotels mapping list"
                )}
              </form>
            </View>
          </View>
        )}
      </View>
      {JSON.stringify(hotelProps)}
      {activeDelete && (
        <DeleteAlert
          deleteFunction={deleteHandler}
          deactivate={deactivateDelete}
          active={activeDelete}
        />
      )}
    </View>
  );
};
export default HotelMap;
