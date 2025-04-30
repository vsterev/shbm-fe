import React, { useEffect, useState } from "react";
import styles from "../styles/tableView.module.css";
import {
  Booking,
  SearchBookingsParams,
} from "../../interfaces/booking.interface";
import SpannedRow from "./SpannedRow";

interface HistoryViewProps {
  bookingsArr: Booking[];
  params: SearchBookingsParams;
}

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
      }),
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
              <th>sent to integration</th>
              <th>action</th>
              <th>hotel</th>
              <th>room</th>
              <th>check-in</th>
              <th>check-out</th>
              <th>accomm.</th>
              <th>confirmation</th>
              <th>tourists</th>
              <th>date create in Il</th>
              <th>integration log</th>
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
                      {el.hotelServices[0].log?.sendDate
                        ?.toString()
                        .substring(0, 16)
                        .replace("T", " ")}
                    </td>
                    <td>{el.action}</td>
                    <td>{el.hotelServices[0].hotel}</td>
                    <td rowSpan={el.hotelServices.length}>
                      {/* {el.hotelServices.map(hts => <div>{hts.roomType + " - " + hts.roomCategory}</div>)} */}
                      <SpannedRow
                        hotelServices={el.hotelServices}
                        item="roomType"
                        subItem="roomCategory"
                      />
                    </td>
                    <td>{el.hotelServices[0].checkIn?.substring(0, 10)}</td>
                    <td>{el.hotelServices[0].checkOut?.substring(0, 10)}</td>
                    <td rowSpan={el.hotelServices.length}>
                      <SpannedRow
                        hotelServices={el.hotelServices}
                        item="roomAccommodation"
                      />
                    </td>
                    <td rowSpan={el.hotelServices.length}>
                      <SpannedRow
                        hotelServices={el.hotelServices}
                        item="confirmationNumber"
                      />
                    </td>
                    <td
                      className={styles.bookingsName}
                      rowSpan={el.hotelServices.length}
                    >
                      <SpannedRow
                        hotelServices={el.hotelServices}
                        item="tourists"
                      />
                    </td>
                    <td>
                      {el.creationDate?.substring(0, 16).replace("T", " ")}
                    </td>
                    <td onClick={() => toggleView(i)}>
                      <span>{toggleArr[i] === false ? "view" : "hide"}</span>
                    </td>
                  </tr>
                  <tr></tr>
                  {toggleArr[i] === true && (
                    <tr>
                      <td colSpan={14}>
                        {el?.hotelServices.some((hts) => hts.log) && (
                          <div>
                            <h4>integration log:</h4>
                            {el.hotelServices.map((hts, index) => {
                              return (
                                <div
                                  key={index}
                                  style={{ marginBottom: "10px" }}
                                >
                                  <h5>Room {index + 1}:</h5>
                                  <pre
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      textAlign: "left",
                                      // backgroundColor: '#f9f9f9',
                                      padding: "10px",
                                      borderRadius: "5px",
                                      // border: '1px solid #ddd',
                                    }}
                                  >
                                    {JSON.stringify(hts.log, null, 2)}
                                  </pre>
                                </div>
                              );
                            })}
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
