import { useState, useEffect } from "react";
import hotelServise from "../services/parser";
import styles from "./styles/HotelMap.module.css";
import parseCookie from "../utils/parseCookie";
import { Helmet } from "react-helmet-async";
import { ParserHotelResponse } from "../interfaces/parser.interface";
import { Hotel } from "../interfaces/hotel.interface";
import HotelService from "../services/hotel";
// import UserContext from "../utils/userContext";

const HotelMap = () => {
  const [hotels, setHotels] = useState<{ parserHotels: ParserHotelResponse[], interLookHotels: string[] } | undefined>(undefined);
  const [strSearchHotel, setStrSearchHotel] = useState<string>("");
  const [hotelInterlookProps, setHotelInterlookProps] = useState<Hotel[]>([]);
  const token = parseCookie("parser-token");
  // const { logOut } = useContext(UserContext)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const htls = await hotelServise.compareHotel(token);
        // if (htls.msg) {
        //   logOut();
        // }
        setHotels(htls);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHotels();
  }, [hotelInterlookProps]);

  const clickHandler = async (b: ParserHotelResponse) => {
    setHotelInterlookProps([]);
    const hotelNameChecked = hotelNameCheck(b.Hotel);
    setStrSearchHotel(hotelNameChecked);
    try {
      const result = await HotelService.getHotels({ hotelName: hotelNameChecked.toLowerCase() }, token);
      setHotelInterlookProps(result);
    } catch (error) {
      console.log(error);
    }
  };

  async function submitSearchHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const result = await HotelService.getHotels({ hotelName: strSearchHotel }, token);
      setHotelInterlookProps(result);
    } catch (error) {
      console.log(error);
    }
  }

  const submitHandler = (e: React.MouseEvent<HTMLButtonElement>, el: Hotel) => {
    e.preventDefault();
    if (!el.parserCode) {
      window.alert(
        "Not empty string is allowed, please fill parser code or delete all mappings for this hotel"
      );
      return;
    }
    HotelService
      .editHotel({ hotelId: +el._id, parserCode: +el.parserCode }, token)
      .then((r) => {
        setHotelInterlookProps([]);
      })
      .catch(console.log);
  };

  function deleteHandler(e: React.MouseEvent<HTMLButtonElement>, el: Hotel) {
    e.preventDefault();
    if (!el.parserCode) {
      window.alert("Hotel is not mapped, nothing to delete");
      return;
    }
    if (
      window.confirm(
        `Confirm delete of ${el.name}, all mappings also will be deleted`
      )
    ) {
      console.log(`delete ${JSON.stringify(el)}`);
      HotelService
        .deleteMappingVariants({
          hotelId:
            +el._id
        }, token)
        .then((r) => {
          console.log(r);
          // setDeleted(true)
          setHotelInterlookProps([]);
        })
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

  const changeParserProps = (e: React.ChangeEvent<HTMLInputElement>, itm: Hotel) => {
    const { name, value } = e.target as { name: keyof Hotel, value: string };
    const index = hotelInterlookProps.findIndex((el) => el._id === itm._id);
    const tempArr: Hotel[] = [...hotelInterlookProps];
    tempArr[index][name] = value;
    setHotelInterlookProps(tempArr);
  };

  return (
    <>
      <Helmet>
        <title>HBS - hotels mapping table</title>
      </Helmet>
      <div className={styles.wrap}>
        <h2>Parser hotels listing</h2>
        <div>
          {!hotels ? (
            <div>Loading hotels ...</div>
          ) : (
            hotels?.parserHotels?.map((el) => {
              return (
                <button
                  className={
                    el.mapped ? styles.buttonHotelMap : styles.buttonHotelNoMap
                  }
                  onClick={() => clickHandler(el)}
                  key={el.HotelID}
                >
                  {" "}
                  {el.Hotel}, {el.HotelID}{" "}
                </button>
              );
            })
          )}
          <hr />
        </div>
        <h2>find it in Interlook: </h2>
        <form onSubmit={submitSearchHandler}>
          <input
            type="text"
            value={strSearchHotel}
            onChange={(e) =>
              setStrSearchHotel(e.target.value)
            }
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
          {hotelInterlookProps.length > 0
            ? hotelInterlookProps.map((el, i) => {
              return (
                <div key={el._id}>
                  {i + 1}, {el.name}, {el.resort},{el._id},{" "}
                  <label htmlFor="parserCosde">parser code: </label>
                  <input
                    type="text"
                    name="parserCode"
                    id="parserCode"
                    value={el.parserCode || ""}
                    onChange={(e) => changeParserProps(e, el)}
                  />{" "}
                  <button
                    onClick={(e) => submitHandler(e, el)}
                    className={styles.submitButton}
                    disabled={!hotelInterlookProps[i].parserCode}
                  >
                    map it
                  </button>
                  <button
                    onClick={(e) => deleteHandler(e, el)}
                    className={styles.deleteButton}
                    disabled={!hotelInterlookProps[i].parserCode}
                  >
                    delete
                  </button>
                </div>
              );
            })
            : "please select a hotel or refine the search to display hotels mapping list"}
        </form>
      </div>
      {JSON.stringify(hotelInterlookProps)}
    </>
  );
};
export default HotelMap;
