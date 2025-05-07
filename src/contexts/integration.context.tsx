/* eslint-disable react-refresh/only-export-components */
import React, { createContext, PropsWithChildren, useContext, useState } from 'react';

export interface Integration {
  name: string;
  displayName: string;
  code: string;
}

interface IntegrationContextType {
  integrations: Integration[];
  setIntegrations: React.Dispatch<React.SetStateAction<Integration[]>>;
  selectedIntegration: Integration | undefined;
  setSelectedIntegration: React.Dispatch<React.SetStateAction<Integration | undefined>>;
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);
export const useIntegrationContext = () => {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegrationContext must be used within an IntegrationProvider');
  }
  return context;
};

export const IntegrationProvider = ({ children }: PropsWithChildren) => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | undefined>(
    undefined
  );

  return (
    <IntegrationContext.Provider
      value={{
        integrations,
        setIntegrations,
        selectedIntegration,
        setSelectedIntegration,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};
