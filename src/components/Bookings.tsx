import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import service from "../services/interlook";
import parseCookie from "../utils/parseCookie";
import styles from "./styles/Bookings.module.css";
import { Booking } from "../interfaces/booking.interface";

interface ResultSendBookings { errors: number, sended: number, confirmed: number, notConfirmed: number, cancelled: number }
const GetBookings = () => {
  const [newBookings, setNewBookings] = useState<Booking[]>([]);
  const [newArr, setNewArr] = useState<boolean[]>([]);
  const [changedBookings, setChangedBookings] = useState<Booking[]>([]);
  const [changeArr, setChangeArr] = useState<boolean[]>([]);
  const [cancelBookings, setCancelBookings] = useState<Booking[]>([]);
  const [cancelArr, setCancelArr] = useState<boolean[]>([]);
  const token = parseCookie("parser-token");
  const [refresh, setRefresh] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [result, setResult] = useState<ResultSendBookings>({} as ResultSendBookings);

  useEffect(() => {
    service.getBookings({ action: "new", next: false }, token).then((rs) => {
      // if (rs.msg) {
      //   logOut();
      // }
      // const tempArr = rs.map(el => { return { checked: false, ...el } })
      setNewBookings(rs);
      setNewArr(new Array(rs.length).fill(false));
    });
    service.getBookings({ action: "change", next: false }, token).then((rs) => {
      setChangedBookings(rs);
      setChangeArr(new Array(rs.length).fill(false));
    });
    service.getBookings({ action: "cancel", next: false }, token).then((rs) => {
      setCancelBookings(rs);
      setCancelArr(new Array(rs.length).fill(false));
    });
  }, [refresh]);

  const changeHandler = (i: number, type: "new" | "change" | "cancel") => {
    if (isDisabled) {
      setIsDisabled(false);
    }
    objAction[type][0](
      Array.isArray(objAction[type][1]) ? objAction[type][1].map((el, ix) => {
        if (ix === i) {
          return !el;
        }
        return el;
      }) : []
    );
  };
  const objAction: {
    [key: string]: [(d: boolean[]) => void, boolean[], Booking[]];
  } = {
    cancel: [(d: boolean[]) => setCancelArr(d), cancelArr, cancelBookings],
    change: [(d: boolean[]) => setChangeArr(d), changeArr, changedBookings],
    new: [(d: boolean[]) => setNewArr(d), newArr, newBookings],
  };
  const submitHandler = (data: { type: "new" | "change" | "cancel" }) => {
    setIsDisabled(true);
    const { type } = data;
    const sendArr = objAction[type][1]
      .map((el, i) => {
        if (el === true) {
          return objAction[type][2][i];
        }
      })
      .filter((el) => !!el);

    // console.log({ type, arr: objAction[type][2] })
    // console.log({sendArr})
    service.sendBookings(sendArr, token).then((rs) => {
      setResult(rs);
      setTimeout(() => {
        setResult({} as ResultSendBookings);
      }, 3000);
      setRefresh(refresh + 1);
    });
  };
  const selectAll = (data: { action: "select" | "deselect", type: "new" | "change" | "cancel" }) => {
    if (isDisabled) {
      setIsDisabled(false);
    }
    const { action, type } = data;
    // setCancelArr(cancelArr.map(el => el = action==="select"?true:false))
    objAction[type][0](
      objAction[type][1]?.map(() => action === "select" ? true : false)
    );
    // navigate("/test/12", {state: {message:"test"}})
  };
  return (
    <>
      <Helmet>
        <title>HBS - Bookings window</title>
      </Helmet>
      <h1>{refresh}</h1>
      <div className={styles.bookingWrap}>
        <h2>Interlook bookings state</h2>
        <div>
          <h4>New</h4>
          {/* {JSON.stringify(newArr)} */}
          <button
            className={styles.toggleButton}
            onClick={() => selectAll({ action: "select", type: "new" })}
          >
            select all
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => selectAll({ action: "deselect", type: "new" })}
          >
            deselect all
          </button>
          {newBookings !== null && Array.isArray(newBookings) ? (
            newBookings?.map((el, index: number) => {
              return (
                <div key={el.bookingId}>
                  <input
                    type="checkbox"
                    // name={el.bookingName}
                    checked={newArr?.[index] || false}
                    onChange={() => changeHandler(index, "new")}
                  />
                  <b>{el.bookingName}</b>, {el.hotelServices[0].hotel},{" "}
                  {el.hotelServices[0].checkIn.substring(0, 10)},{" "}
                  {el.hotelServices[0].checkOut.substring(0, 10)},
                  {el.hotelServices[0].roomAccommodation},{" "}
                  {el.hotelServices[0].roomType}-
                  {el.hotelServices[0].roomCategory},{" "}
                  {el.hotelServices[0].pansion}
                </div>
              );
            })
          ) : (
            <div>Loading ...</div>
          )}
          <button
            className={styles.submitButton}
            onClick={() => submitHandler({ type: "new" })}
            disabled={newArr?.every((el) => el === false) || isDisabled}
          >
            send
          </button>
        </div>
        <div>
          <h4>Changed</h4>
          {/* {JSON.stringify(changeArr)} */}
          {/* {JSON.stringify(changedBookings)} */}

          <button
            className={styles.toggleButton}
            onClick={() => selectAll({ action: "select", type: "change" })}
          >
            select all
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => selectAll({ action: "deselect", type: "change" })}
          >
            deselect all
          </button>
          {changedBookings !== null && Array.isArray(changedBookings) ? (
            changedBookings.map((el, i) => {
              return (
                <div key={el?.bookingId}>
                  <input
                    type="checkbox"
                    // name={el.bookingName}
                    checked={changeArr?.[i] || false}
                    onChange={() => changeHandler(i, "change")}
                  />
                  <b>{el?.bookingName}</b>, {el?.hotelServices[0]?.hotel},{" "}
                  {el?.hotelServices[0]?.checkIn.substring(0, 10)},{" "}
                  {el?.hotelServices[0]?.checkOut.substring(0, 10)},
                  {el?.hotelServices[0]?.roomAccommodation},{" "}
                  {el?.hotelServices[0]?.roomType}-
                  {el?.hotelServices[0]?.roomCategory},{" "}
                  {el?.hotelServices[0]?.pansion},
                </div>
              );
            })
          ) : (
            <div>Loading ...</div>
          )}
          <button
            className={styles.submitButton}
            onClick={() => submitHandler({ type: "change" })}
            disabled={changeArr?.every((el) => el === false) || isDisabled}
          >
            send
          </button>
        </div>
        <div>
          <h4>Canceled</h4>
          {/* {JSON.stringify(cancelArr)} */}
          <button
            className={styles.toggleButton}
            onClick={() => selectAll({ action: "select", type: "cancel" })}
          >
            select all
          </button>
          <button
            className={styles.toggleButton}
            onClick={() => selectAll({ action: "deselect", type: "cancel" })}
          >
            deselect all
          </button>

          {cancelBookings !== null && Array.isArray(cancelBookings) ? (
            cancelBookings.map((el, i) => {
              return (
                <div key={el.bookingId}>
                  <input
                    type="checkbox"
                    // name={el.bookingName}
                    checked={cancelArr?.[i] || false}
                    onChange={() => changeHandler(i, "cancel")}
                  />
                  <b>{el.bookingName}</b>, {el.hotelServices[0].hotel},{" "}
                  {el.hotelServices[0].checkIn.substring(0, 10)},{" "}
                  {el.hotelServices[0].checkOut.substring(0, 10)},
                  {el.hotelServices[0].roomAccommodation},{" "}
                  {el.hotelServices[0].roomType}-
                  {el.hotelServices[0].roomCategory},{" "}
                  {el.hotelServices[0].pansion}
                </div>
              );
            })
          ) : (
            <div>Loading ...</div>
          )}
          <button
            className={styles.submitButton}
            onClick={() => submitHandler({ type: "cancel" })}
            disabled={cancelArr?.every((el) => el === false) || isDisabled}
          >
            send
          </button>
        </div>
        {Object.keys(result).length > 0 && (
          <div>
            sended:{result.sended}, confirmed:{result.confirmed}, not confirmed:
            {result.notConfirmed}, cancelled:{result.cancelled}, errors:{" "}
            {result.errors}
          </div>
        )}
      </div>
    </>
  );
};
export default GetBookings;
