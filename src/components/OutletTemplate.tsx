import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import IntegrationSelector from './IntegrationSelector';
import { Container, View } from 'reshaped';
const OutletTemplate = () => {
  const location = useLocation();
  return (
    <Container width="100vw" height="100vh" padding={0}>
      <View direction="column" backgroundColor="neutral-faded" grow justify="space-between">
        <View>
          <Header />
          {!['users', 'history'].includes(
            location.pathname.substring(1, location.pathname.length)
          ) && <IntegrationSelector />}
          <Outlet />
        </View>
        <View>
          <Footer />
        </View>
      </View>
    </Container>
  );
};
export default OutletTemplate;
