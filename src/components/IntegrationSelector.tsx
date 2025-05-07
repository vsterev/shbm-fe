import { useEffect } from 'react';
import { useIntegrationContext } from '../contexts/integration.context';
import appCookie from '../utils/appCookie';
import IntegrationService from '../services/integration';
import { FormControl, Select, View } from 'reshaped';

const IntegrationSelector = () => {
  const { integrations, setIntegrations, selectedIntegration, setSelectedIntegration } =
    useIntegrationContext();

  const token = appCookie('hbs-token');

  useEffect(() => {
    IntegrationService.getIntegrations(token).then((data) => setIntegrations(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <View padding={4}>
      <FormControl>
        <View direction="row" justify="start" align="center" gap={4} grow>
          <FormControl.Label>Choosen integration</FormControl.Label>
          <Select
            name="integration"
            placeholder="Select an integration"
            value={selectedIntegration?.name}
            onChange={(e) => {
              const selectedIntegration = integrations.find((i) => i.name === e.value);
              setSelectedIntegration(selectedIntegration);
            }}
            options={integrations.map((integration) => ({
              label: integration.displayName,
              value: integration.name,
            }))}
          />
        </View>
      </FormControl>
    </View>
  );
};
export default IntegrationSelector;
