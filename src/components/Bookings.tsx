import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import BookingService from "../services/booking";
import appCookie from "../utils/appCookie";
import styles from "./styles/Bookings.module.css";
import { Booking } from "../interfaces/booking.interface";
import ReactLoading from "react-loading";
import { useIntegrationContext } from "../contexts/integration.context";
import { toast } from "react-toastify";

interface ResultSendBookings {
  errors: number;
  sended: number;
  confirmed: number;
  notConfirmed: number;
  cancelled: number;
}
const GetBookings = () => {
  const [newBookings, setNewBookings] = useState<Booking[]>([]);
  const [newArr, setNewArr] = useState<boolean[]>([]);
  const [changedBookings, setChangedBookings] = useState<Booking[]>([]);
  const [changeArr, setChangeArr] = useState<boolean[]>([]);
  const [cancelBookings, setCancelBookings] = useState<Booking[]>([]);
  const [cancelArr, setCancelArr] = useState<boolean[]>([]);
  const token = appCookie("hbs-token");
  const [refresh, setRefresh] = useState(1);
  const [isDisabled, setIsDisabled] = useState(false);
  const [newLoading, setNewLoading] = useState<boolean>(false);
  const [changeLoading, setChangeLoading] = useState<boolean>(false);
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);
  const { selectedIntegration } = useIntegrationContext();

  useEffect(() => {
    if (!selectedIntegration) {
      return;
    }

    setNewLoading(true);
    setChangeLoading(true);
    setCancelLoading(true);

    BookingService.get(
      { status: "new", next: false },
      token,
      selectedIntegration.name,
    )
      .then((rs) => {
        // if (rs.msg) {
        //   logOut();
        // }
        // const tempArr = rs.map(el => { return { checked: false, ...el } })
        if (Array.isArray(rs) && rs.length === 0) {
          toast.info("No new bookings");
        }
        setNewBookings(rs);
        setNewArr(new Array(rs.length).fill(false));
      })
      .finally(() => setNewLoading(false));

    BookingService.get(
      { status: "change", next: false },
      token,
      selectedIntegration.name,
    )
      .then((rs) => {
        if (Array.isArray(rs) && rs.length === 0) {
          toast.info("No changed bookings");
        }
        setChangedBookings(rs);
        setChangeArr(new Array(rs.length).fill(false));
      })
      .finally(() => setChangeLoading(false));

    BookingService.get(
      { status: "cancel", next: false },
      token,
      selectedIntegration.name,
    )
      .then((rs) => {
        if (Array.isArray(rs) && rs.length === 0) {
          toast.info("No cancellations");
        }
        setCancelBookings(rs);
        setCancelArr(new Array(rs.length).fill(false));
      })
      .finally(() => setCancelLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, selectedIntegration]);

  const changeHandler = (i: number, type: "new" | "change" | "cancel") => {
    if (isDisabled) {
      setIsDisabled(false);
    }
    objAction[type][0](
      Array.isArray(objAction[type][1])
        ? objAction[type][1].map((el, ix) => {
            if (ix === i) {
              return !el;
            }
            return el;
          })
        : [],
    );
  };

  const objAction: {
    [key: string]: [(d: boolean[]) => void, boolean[], Booking[]];
  } = {
    cancel: [(d: boolean[]) => setCancelArr(d), cancelArr, cancelBookings],
    change: [(d: boolean[]) => setChangeArr(d), changeArr, changedBookings],
    new: [(d: boolean[]) => setNewArr(d), newArr, newBookings],
  };

  const submitHandler = async (data: { type: "new" | "change" | "cancel" }) => {
    if (!selectedIntegration) {
      toast.error("Please select an integration");
      return;
    }

    setIsDisabled(true);
    const { type } = data;
    const sendArr = objAction[type][1]
      .map((el, i) => {
        if (el === true) {
          return objAction[type][2][i];
        }
      })
      .filter((el) => !!el);

    await BookingService.send(sendArr, token, selectedIntegration.name)
      .then((rs) => {
        const { errors, sended, confirmed, cancelled } =
          rs as ResultSendBookings;

        if (errors) {
          toast.error(
            `Error: ${rs.errors} bookings not sended, ${rs.notConfirmed} bookings not confirmed`,
          );
        }

        toast.info(
          `Sended: ${sended}, confirmed: ${confirmed}, cancelled: ${cancelled}`,
        );
      })
      .finally(() => {
        setTimeout(() => {
          setRefresh((prev) => prev + 1);
        }, 5000);
      });
  };

  const selectAll = (data: {
    action: "select" | "deselect";
    type: "new" | "change" | "cancel";
  }) => {
    if (isDisabled) {
      setIsDisabled(false);
    }
    const { action, type } = data;
    objAction[type][0](
      objAction[type][1]?.map(() => (action === "select" ? true : false)),
    );
  };

  if (!selectedIntegration) {
    return (
      <h2 style={{ textAlign: "center" }}>please select an integration</h2>
    );
  }

  return (
    <>
      <Helmet>
        <title>HBS - Bookings window</title>
      </Helmet>
      <div className={styles.bookingWrap}>
        <h2>Interlook bookings state</h2>
        <div>
          <h4>New</h4>
          {!!newBookings.length && (
            <>
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
            </>
          )}
          {newLoading ? (
            <ReactLoading
              type="bubbles"
              color="blue"
              height={100}
              width={100}
            />
          ) : (
            newBookings !== null &&
            Array.isArray(newBookings) &&
            newBookings?.map((el, index: number) => {
              return (
                <div key={el.bookingId}>
                  <input
                    type="checkbox"
                    // name={el.bookingName}
                    checked={newArr?.[index] || false}
                    onChange={() => changeHandler(index, "new")}
                  />
                  <b>{" " + el?.bookingName}</b>,{" "}
                  {el?.hotelServices?.[0]?.hotel},{" "}
                  {el.hotelServices[0].checkIn.substring(0, 10)},{" "}
                  {el.hotelServices[0].checkOut.substring(0, 10)},
                  {el.hotelServices[0].roomAccommodation},{" "}
                  {el.hotelServices[0].roomType}-
                  {el.hotelServices[0].roomCategory},{" "}
                  {el.hotelServices[0].pansion}
                </div>
              );
            })
          )}
          {newBookings.length ? (
            <button
              className={styles.submitButton}
              onClick={() => submitHandler({ type: "new" })}
              disabled={newArr?.every((el) => el === false) || isDisabled}
            >
              send
            </button>
          ) : (
            "0 bookings"
          )}
        </div>
        <div>
          <h4>Changed</h4>
          {!!changedBookings.length && (
            <>
              <button
                className={styles.toggleButton}
                onClick={() => selectAll({ action: "select", type: "change" })}
              >
                select all
              </button>
              <button
                className={styles.toggleButton}
                onClick={() =>
                  selectAll({ action: "deselect", type: "change" })
                }
              >
                deselect all
              </button>
            </>
          )}
          {changeLoading ? (
            <ReactLoading
              type="bubbles"
              color="blue"
              height={100}
              width={100}
            />
          ) : (
            changedBookings !== null &&
            Array.isArray(changedBookings) &&
            changedBookings.map((el, i) => {
              return (
                <div key={el?.bookingId}>
                  <input
                    type="checkbox"
                    // name={el.bookingName}
                    checked={changeArr?.[i] || false}
                    onChange={() => changeHandler(i, "change")}
                  />
                  <b>{" " + el?.bookingName}</b>, {el?.hotelServices[0]?.hotel},{" "}
                  {el?.hotelServices[0]?.checkIn.substring(0, 10)},{" "}
                  {el?.hotelServices[0]?.checkOut.substring(0, 10)},
                  {el?.hotelServices[0]?.roomAccommodation},{" "}
                  {el?.hotelServices[0]?.roomType}-
                  {el?.hotelServices[0]?.roomCategory},{" "}
                  {el?.hotelServices[0]?.pansion},
                </div>
              );
            })
          )}
          {changedBookings.length ? (
            <button
              className={styles.submitButton}
              onClick={() => submitHandler({ type: "change" })}
              disabled={changeArr?.every((el) => el === false) || isDisabled}
            >
              send
            </button>
          ) : (
            "0 bookings"
          )}
        </div>
        <div>
          <h4>Canceled</h4>
          {!!cancelBookings.length && (
            <>
              <button
                className={styles.toggleButton}
                onClick={() => selectAll({ action: "select", type: "cancel" })}
              >
                select all
              </button>
              <button
                className={styles.toggleButton}
                onClick={() =>
                  selectAll({ action: "deselect", type: "cancel" })
                }
              >
                deselect all
              </button>
            </>
          )}

          {cancelLoading ? (
            <ReactLoading
              type="bubbles"
              color="blue"
              height={100}
              width={100}
            />
          ) : (
            cancelBookings !== null &&
            Array.isArray(cancelBookings) &&
            cancelBookings.map((el, i) => {
              return (
                <div key={el.bookingId}>
                  <input
                    type="checkbox"
                    // name={el.bookingName}
                    checked={cancelArr?.[i] || false}
                    onChange={() => changeHandler(i, "cancel")}
                  />
                  <b>{" " + el.bookingName}</b>, {el.hotelServices[0].hotel},{" "}
                  {el.hotelServices[0].checkIn.substring(0, 10)},{" "}
                  {el.hotelServices[0].checkOut.substring(0, 10)},
                  {el.hotelServices[0].roomAccommodation},{" "}
                  {el.hotelServices[0].roomType}-
                  {el.hotelServices[0].roomCategory},{" "}
                  {el.hotelServices[0].pansion}
                </div>
              );
            })
          )}
          {cancelBookings.length ? (
            <button
              className={styles.submitButton}
              onClick={() => submitHandler({ type: "cancel" })}
              disabled={cancelArr?.every((el) => el === false) || isDisabled}
            >
              send
            </button>
          ) : (
            "0 bookings"
          )}
        </div>
      </div>
    </>
  );
};
export default GetBookings;
