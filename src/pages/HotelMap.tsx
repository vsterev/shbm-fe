import { useState, useEffect } from 'react';
import appCookie from '../utils/appCookie';
import { Helmet } from 'react-helmet-async';
import { HotelInterlook, IntegratedHotelResponse } from '../interfaces/hotel.interface';
import HotelService from '../services/hotel';
import { useIntegrationContext } from '../contexts/integration.context';
import { Loader, useToggle, View } from 'reshaped';
import IntegrationAlert from '../components/shared/integrationAlert';
import DeleteAlert from '../components/shared/DeleteAlert';
import useToastService from '../utils/toastService';
import IntegrationHotelMap from '../components/hotelsMap/integrationHotel';
import SearchIntrlookHotel from '../components/hotelsMap/seachInterlookHotel';
import InterlookHotelMap from '../components/hotelsMap/InterlookHotelMap';

const HotelMap = () => {
  const { selectedIntegration } = useIntegrationContext();
  const [hotels, setHotels] = useState<
    { integratedHotels: IntegratedHotelResponse[]; interLookHotels: number[] } | undefined
  >(undefined);
  const [strSearchHotel, setStrSearchHotel] = useState<string>('');
  const [hotelProps, setHotelProps] = useState<HotelInterlook[]>([]);
  const [refreshAfterMap, setRefreshAfterMap] = useState<boolean>(false);
  const [deleteHotelMap, setDeleteHotelMap] = useState<HotelInterlook | undefined>(undefined);
  const token = appCookie('hbs-token');
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
    setStrSearchHotel('');
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
        toast.error('Error fetching hotels');
        console.error(error);
      }
    };

    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIntegration, refreshAfterMap]);

  async function deleteHandler() {
    if (!deleteHotelMap || !selectedIntegration) {
      return;
    }

    await HotelService.delete(
      {
        hotelId: +deleteHotelMap._id,
        integrationName: selectedIntegration.name,
      },
      token
    )
      .finally(() => setRefreshAfterMap((prev) => !prev))
      .catch(console.log);
  }

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
        {!selectedIntegration || !hotels ? (
          <View width="100%" justify="center" align="center">
            <Loader size="large" ariaLabel="Loading" />
          </View>
        ) : (
          <View gap={4}>
            <IntegrationHotelMap
              selectedIntegration={selectedIntegration}
              setHotelProps={setHotelProps}
              setStrSearchHotel={setStrSearchHotel}
              refreshAfterMap={refreshAfterMap}
              token={token}
              hotels={hotels}
              setHotels={setHotels}
            />
            <SearchIntrlookHotel
              selectedIntegration={selectedIntegration}
              token={token}
              setHotelProps={setHotelProps}
              strSearchHotel={strSearchHotel}
              setStrSearchHotel={setStrSearchHotel}
            />
            <InterlookHotelMap
              token={token}
              activateDelete={activateDelete}
              setDeleteHotelMap={setDeleteHotelMap}
              setRefreshAfterMap={setRefreshAfterMap}
              setHotelProps={setHotelProps}
              selectedIntegration={selectedIntegration}
              hotelProps={hotelProps}
            />
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
