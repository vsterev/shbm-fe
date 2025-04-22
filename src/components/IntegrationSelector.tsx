import { useEffect } from "react";
import { useIntegrationContext } from "../contexts/integration.context";
import appCookie from "../utils/appCookie";
import IntegrationService from "../services/integration";

const IntegrationSelector = () => {
  const {
    integrations,
    setIntegrations,
    selectedIntegration,
    setSelectedIntegration,
  } = useIntegrationContext();

  const token = appCookie("hbs-token");

  useEffect(() => {
    IntegrationService.getIntegrations(token).then((data) =>
      setIntegrations(data),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div style={{ margin: "1rem" }}>
      <label htmlFor="integration">Used integration: </label>
      <select
        name="integration"
        value={selectedIntegration?.name}
        onChange={(e) => {
          const selectedIntegration = integrations.find(
            (i) => i.name === e.target.value,
          );
          setSelectedIntegration(selectedIntegration);
        }}
      >
        <option value="">Select an integration</option>
        {integrations.length &&
          integrations?.map((i) => (
            <option key={i.name} value={i.name}>
              {i.displayName}
            </option>
          ))}
      </select>
    </div>
  );
};
export default IntegrationSelector;
