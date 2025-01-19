import React, { useEffect, useState } from "react";
import styles from "../styles/tableView.module.css";
import { Booking, SearchBookingsParams } from "../../interfaces/booking.interface";

interface HistoryViewProps {
  bookingsArr: Booking[];
  params: SearchBookingsParams
};

const HistoryView = ({ bookingsArr, params }: HistoryViewProps) => {

  const [toggleArr, setToggleArr] = useState<boolean[]>([]);

  useEffect(() => {
    setToggleArr(new Array(bookingsArr.length).fill(false));
  }, [bookingsArr]);

  const toggleView = (index: number) => {

    setToggleArr(
      toggleArr.map((el, i) => {
        if (i === index) {
          return (el = !el);
        }
        return el;
      })
    );
  };

  return (
    <>
      {bookingsArr?.length > 0 ? (
        <table className={styles.bookings}>
          <thead>
            <tr>
              <th>№</th>
              <th>booking</th>
              <th>date send to parser</th>
              <th>action</th>
              <th>hotel</th>
              <th>room</th>
              <th>check-in</th>
              <th>check-out</th>
              <th>accomm.</th>
              <th>confirmation</th>
              <th>tourists</th>
              <th>date create in Il</th>
              <th>parser info</th>
            </tr>
          </thead>
          <tbody>
            {bookingsArr.map((el, i) => {
              return (
                <React.Fragment key={i}>
                  <tr>
                    <td>{i + 1 + params.skip}</td>
                    <td>{el.bookingName}</td>
                    <td>
                      {el.dateInputed?.substring(0, 16).replace("T", " ")}
                    </td>
                    <td>{el.action}</td>
                    <td>{el.hotelService?.hotel}</td>
                    <td>
                      {el.hotelService?.roomType}-{el.hotelService?.roomCategory}
                    </td>
                    <td>{el.hotelService?.checkIn?.substring(0, 10)}</td>
                    <td>{el.hotelService?.checkOut?.substring(0, 10)}</td>
                    <td>{el.hotelService?.roomAccommodation}</td>
                    <td>{el.parser?.response?.ConfirmationNo}</td>
                    <td className={styles.bookingsName}>
                      {el.hotelService?.tourists.map((el, i: number) => {
                        return (
                          <div key={i}>
                            {el.sex}, {el.name},{" "}
                            {el.birthDate?.substring(0, 10)}
                          </div>
                        );
                      })}
                    </td>
                    <td>
                      {el.creationDate?.substring(0, 16).replace("T", " ")}
                    </td>
                    <td onClick={() => toggleView(i)}>
                      <span>{toggleArr[i] === false ? "view" : "hide"}</span>
                    </td>
                  </tr>
                  {toggleArr[i] === true && (
                    <tr>
                      <td colSpan={13}>
                        {el?.parser?.send?.Names && el.parser.send.Names.length > 0 && (
                          <>
                            <div>request: {JSON.stringify(el.parser?.send)}</div>
                            <div>
                              response: {JSON.stringify(el.parser?.response)}
                            </div>
                          </>
                        )}
                        {!!el?.parser?.manual?.confirm && (
                          <div>
                            confirm: {JSON.stringify(el.parser.manual.confirm)}
                          </div>
                        )}
                        {!!el?.parser?.manual?.deny && (
                          <div>
                            deny: {JSON.stringify(el.parser.manual.deny)}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div style={{ textAlign: "center" }}>please enter search criteria</div>
      )}
    </>
  );
};
export default HistoryView;
