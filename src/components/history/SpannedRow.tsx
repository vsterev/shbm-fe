import React from 'react';
import { HotelServiceBooking } from '../../interfaces/booking.interface';

interface SpannedRowProps {
    hotelServices: HotelServiceBooking[];
    item: (keyof HotelServiceBooking);
    subItem?: (keyof HotelServiceBooking);
}

const SpannedRow = ({ hotelServices, item, subItem }: SpannedRowProps) => {
    return (
        <>
            {hotelServices.map((hts, index) =>
                <React.Fragment key={index}>
                    <div style={{ textAlign: 'center' }}>
                        {Array.isArray(hts[item])
                            ? item === "tourists" && hts[item].map((tourist, touristIndex) => {
                                return (
                                    <div key={touristIndex}>
                                        {tourist.sex}, {tourist.name},{' '}
                                        {tourist.birthDate?.substring(0, 10)}
                                    </div>
                                )
                            }) // Convert arrays to a string representation
                            : typeof hts[item] === 'object' && hts[item] !== null
                                ? JSON.stringify(hts[item]) // Convert objects to a string representation
                                : String(hts[item]) + (subItem && hts[subItem] ? ` -  ${String(hts[subItem])}` : '')}
                    </div>
                    {hotelServices.length > index + 1 && <hr style={{ margin: '5px' }} />}
                </React.Fragment>
            )}
        </>
    );
};

export default SpannedRow;