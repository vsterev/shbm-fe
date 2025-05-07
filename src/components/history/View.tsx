import React, { useEffect, useState } from 'react';
import { Booking, SearchBookingsParams } from '../../interfaces/booking.interface';
import SpannedRow from './SpannedRow';
import { View, Text, Table, Button } from 'reshaped';

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
      })
    );
  };

  return (
    <View>
      {bookingsArr?.length > 0 ? (
        <Table border>
          <Table.Head>
            <Table.Row highlighted>
              <Table.Heading>№</Table.Heading>
              <Table.Heading>booking</Table.Heading>
              <Table.Heading>sent to integration</Table.Heading>
              <Table.Heading>action</Table.Heading>
              <Table.Heading>hotel</Table.Heading>
              <Table.Heading>room</Table.Heading>
              <Table.Heading>check-in</Table.Heading>
              <Table.Heading>check-out</Table.Heading>
              <Table.Heading>accomm.</Table.Heading>
              <Table.Heading>confirmation</Table.Heading>
              <Table.Heading>tourists</Table.Heading>
              <Table.Heading>date create in Il</Table.Heading>
              <Table.Heading>integration log</Table.Heading>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {bookingsArr.map((el, i) => {
              return (
                <React.Fragment key={i}>
                  <Table.Row>
                    <Table.Cell>{i + 1 + params.skip}</Table.Cell>
                    <Table.Cell>{el.bookingName}</Table.Cell>
                    <Table.Cell>
                      {el.hotelServices[0]?.log?.sendDate
                        ?.toString()
                        .substring(0, 16)
                        .replace('T', ' ')}
                    </Table.Cell>
                    <Table.Cell>{el.action}</Table.Cell>
                    <Table.Cell>{el.hotelServices[0]?.hotel}</Table.Cell>
                    <Table.Cell verticalAlign="center">
                      <SpannedRow
                        hotelServices={el.hotelServices}
                        item="roomType"
                        subItem="roomCategory"
                      />
                    </Table.Cell>
                    <Table.Cell>{el.hotelServices[0].checkIn?.substring(0, 10)}</Table.Cell>
                    <Table.Cell>{el.hotelServices[0].checkOut?.substring(0, 10)}</Table.Cell>
                    <Table.Cell verticalAlign="center">
                      <SpannedRow hotelServices={el.hotelServices} item="roomAccommodation" />
                    </Table.Cell>
                    <Table.Cell verticalAlign="center">
                      <SpannedRow hotelServices={el.hotelServices} item="confirmationNumber" />
                    </Table.Cell>
                    <Table.Cell verticalAlign="center">
                      <SpannedRow hotelServices={el.hotelServices} item="tourists" />
                    </Table.Cell>
                    <Table.Cell>{el.creationDate?.substring(0, 16).replace('T', ' ')}</Table.Cell>
                    <Table.Cell>
                      <Button size="small" variant="ghost" onClick={() => toggleView(i)}>
                        {toggleArr[i] === false ? 'view' : 'hide'}
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                  {toggleArr[i] === true && (
                    <Table.Row>
                      <Table.Cell colSpan={14}>
                        {el?.hotelServices.some((hts) => hts.log) && (
                          <div>
                            <h4>integration log:</h4>
                            {el.hotelServices.map((hts, index) => {
                              return (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                  <h5>Room {index + 1}:</h5>
                                  <pre
                                    style={{
                                      whiteSpace: 'pre-wrap',
                                      textAlign: 'left',
                                      // backgroundColor: '#f9f9f9',
                                      padding: '10px',
                                      borderRadius: '5px',
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
                      </Table.Cell>
                    </Table.Row>
                  )}
                </React.Fragment>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <Text variant="body-2" align="center">
          please enter search criteria
        </Text>
      )}
    </View>
  );
};
export default HistoryView;
