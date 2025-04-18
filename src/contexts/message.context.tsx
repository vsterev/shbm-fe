/* eslint-disable react-refresh/only-export-components */
import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useState,
} from 'react';

interface MessageContextType {
	message: string | undefined;
	setMessage: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
	const context = useContext(MessageContext);
	if (!context) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
};

export const MessageProvider = ({ children }: PropsWithChildren) => {
	const [message, setMessage] = useState<string | undefined>(undefined);

	return (
		<MessageContext.Provider value={{ message, setMessage }}>
			{children}
		</MessageContext.Provider>
	);
};
