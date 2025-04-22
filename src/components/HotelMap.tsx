import { useState, useEffect } from "react";
import styles from "./styles/HotelMap.module.css";
import appCookie from "../utils/appCookie";
import { Helmet } from "react-helmet-async";
import {
  HotelInterlook,
  IntegratedHotelResponse,
} from "../interfaces/hotel.interface";
import HotelService from "../services/hotel";
import ReactLoading from "react-loading";
import { useIntegrationContext } from "../contexts/integration.context";
import { toast } from "react-toastify";

const HotelMap = () => {
  const { selectedIntegration } = useIntegrationContext();
  const [hotels, setHotels] = useState<
    | { integratedHotels: IntegratedHotelResponse[]; interLookHotels: number[] }
    | undefined
  >(undefined);
  const [strSearchHotel, setStrSearchHotel] = useState<string>("");
  const [hotelProps, setHotelProps] = useState<HotelInterlook[]>([]);
  const [refreshAfterMap, setRefreshAfterMap] = useState<boolean>(false);
  const token = appCookie("hbs-token");
  // const { logOut } = useContext(UserContext)

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
        console.log(error);
      }
    };

    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIntegration, refreshAfterMap]);

  const clickHandler = async (b: IntegratedHotelResponse) => {
    setHotelProps([]);
    const hotelNameChecked = hotelNameCheck(b.hotelName);
    setStrSearchHotel(hotelNameChecked);

    try {
      const result = await HotelService.get(
        { hotelName: hotelNameChecked.toLowerCase() },
        token,
      );
      setHotelProps(result);
    } catch (error) {
      console.log(error);
    }
  };

  async function submitSearchHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const result = await HotelService.get(
        { hotelName: strSearchHotel },
        token,
      );
      setHotelProps(result);
    } catch (error) {
      console.log(error);
    }
  }

  const mapHandler = async (
    e: React.MouseEvent<HTMLButtonElement>,
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

  function deleteHandler(
    e: React.MouseEvent<HTMLButtonElement>,
    el: HotelInterlook,
  ) {
    e.preventDefault();

    if (!selectedIntegration) {
      window.alert("please select integration");
      return;
    }

    if (!el.integrationSettings?.hotelCode) {
      window.alert("Hotel is not mapped, nothing to delete");
      return;
    }

    if (
      window.confirm(
        `Confirm delete of ${el.name}, all mappings also will be deleted`,
      )
    ) {
      HotelService.delete(
        {
          hotelId: +el._id,
          integrationName: selectedIntegration.name,
        },
        token,
      )
        .finally(() => setRefreshAfterMap((prev) => !prev))
        .catch(console.log);
    } else {
      console.log("You rejected delete");
    }
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
    e: React.ChangeEvent<HTMLInputElement>,
    itm: HotelInterlook,
  ) => {
    const { value } = e.target;

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
  if (!selectedIntegration?.code) {
    return (
      <h2 style={{ textAlign: "center" }}>please select an integration</h2>
    );
  }

  return (
    <>
      <Helmet>
        <title>HBS - hotels mapping table</title>
      </Helmet>
      <div className={styles.wrap}>
        {selectedIntegration && !hotels ? (
          <ReactLoading type="bubbles" color="blue" height={100} width={100} />
        ) : (
          <>
            <h2>{selectedIntegration?.displayName} hotels listing</h2>
            <div>
              {hotels?.integratedHotels?.map((el) => {
                return (
                  <button
                    className={
                      el.mapped
                        ? styles.buttonHotelMap
                        : styles.buttonHotelNoMap
                    }
                    onClick={() => clickHandler(el)}
                    key={el.hotelId}
                  >
                    {" "}
                    {el.hotelName}, {el.hotelId}{" "}
                  </button>
                );
              })}
              <hr />
            </div>
            <h2>find it in Interlook: </h2>
            <form onSubmit={submitSearchHandler}>
              <input
                type="text"
                value={strSearchHotel}
                onChange={(e) => setStrSearchHotel(e.target.value)}
              />
              <button
                className={styles.submitButton}
                disabled={strSearchHotel.length === 0}
              >
                search
              </button>
            </form>
            <h3>Interlook hotels name mapping: </h3>
            <form>
              {hotelProps.length > 0
                ? hotelProps.map((el, i) => {
                    const integrationCode = selectedIntegration.code;
                    return (
                      <div key={el._id}>
                        {i + 1}, {el.name}, {el.resort},{el._id},{" "}
                        <label htmlFor={`integrationCode-${el._id}`}>
                          integration code:{" "}
                        </label>
                        <input
                          type="text"
                          id={`integrationCode-${el._id}`}
                          // value={el[integrationCode] || ''}
                          value={el.integrationSettings?.hotelCode || ""}
                          onChange={(e) => changeHandler(e, el)}
                          name={integrationCode}
                        />{" "}
                        <button
                          onClick={(e) => mapHandler(e, el)}
                          className={styles.submitButton}
                          disabled={!el.integrationSettings?.hotelCode}
                        >
                          map it
                        </button>
                        <button
                          onClick={(e) => deleteHandler(e, el)}
                          className={styles.deleteButton}
                          // disabled={!el[integrationCode]}
                          disabled={!el.integrationSettings?.hotelCode}
                        >
                          delete
                        </button>
                      </div>
                    );
                  })
                : "please select a hotel or refine the search to display hotels mapping list"}
            </form>
          </>
        )}
      </div>
      {JSON.stringify(hotelProps)}
    </>
  );
};
export default HotelMap;
