import { Zap } from 'react-feather';
import { Alert, Button, Modal, View } from 'reshaped';

interface DeleteAlertProps {
  deactivate: () => void;
  active: boolean;
  deleteFunction: () => void;
}

const DeleteAlert = (props: DeleteAlertProps) => {
  return (
    <Modal active={props.active} onClose={props.deactivate} size="medium">
      <Alert
        color="neutral"
        title="Delete alert"
        icon={Zap}
        actionsSlot={
          <View direction="row" justify="space-between" grow>
            <Button variant="solid" color="primary" onClick={props.deactivate}>
              Cancel
            </Button>
            <Button
              variant="solid"
              color="critical"
              onClick={() => {
                props.deleteFunction();
                props.deactivate();
              }}
            >
              Confirm
            </Button>
          </View>
        }
      >
        Are you sure you want to delete? This action cannot be undone.
      </Alert>
    </Modal>
  );
};
export default DeleteAlert;
