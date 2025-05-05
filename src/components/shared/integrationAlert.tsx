import { Alert, View } from "reshaped";
import { Zap } from "react-feather";

interface IntegrationAlertProps {
  message: string;
  title: string;
}

const IntegrationAlert = (props: IntegrationAlertProps) => {
  return (
    <View padding={4}>
      <Alert title={props.title} color="warning" icon={<Zap />}>
        {props.message}
      </Alert>
    </View>
  );
};
export default IntegrationAlert;
