import { useEffect, useState } from "react";
import { IonCol, IonGrid, IonIcon, IonPage, IonRow } from "@ionic/react";
import {
  personCircleOutline,
  swapHorizontalOutline,
  checkmark,
} from "ionicons/icons";
import { PageLayout } from "../../components/layout/PageLayout";
import { i18n } from "../../../i18n";
import "./ConnectionRequest.scss";
import {
  getConnectionRequest,
  setConnectionRequest,
  setCurrentOperation,
} from "../../../store/reducers/stateCache";
import { AriesAgent } from "../../../core/aries/ariesAgent";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { toastState } from "../../constants/dictionary";
import { Alert } from "../../components/Alert";
import {
  connectionRequestData,
  connectionRequestPlaceholder,
} from "../../__fixtures__/connectionsFix";
import { ConnectionRequestData } from "../Connections/Connections.types";
import { TOAST_MESSAGE_DELAY } from "../../../constants/appConstants";

const ConnectionRequest = () => {
  const dispatch = useAppDispatch();
  const connectionRequest = useAppSelector(getConnectionRequest);
  const [showConnectionRequest, setShowConnectionRequest] = useState(false);
  const [initiateAnimation, setInitiateAnimation] = useState(false);
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [connectionData, setConnectionData] = useState<ConnectionRequestData>(
    connectionRequestPlaceholder
  );

  useEffect(() => {
    // @TODO - sdisalvo: this is listening for connection requests
    if (connectionRequest.length) {
      //  If we have a connection request, initiate the Aries agent to fetch data and wait for "state": "request-sent"
      //  it can't currently be tested in my local - will come back to it
      //
      //  await AriesAgent.agent.receiveInvitationFromUrl(connectionRequest);
      //
      //  Update the local data - remember to replace connectionRequestData with real values from the above request
      //
      setConnectionData(connectionRequestData);
      //
      // and show the connection request page accordingly
      setShowConnectionRequest(true);
    }
  }, [connectionRequest]);

  const handleReset = () => {
    dispatch(setConnectionRequest(""));
    setShowConnectionRequest(false);
    setInitiateAnimation(false);
  };

  const handleConnect = async () => {
    // @TODO - sdisalvo: If the user selects confirm, the connection must be accepted
    // by calling acceptRequest from the agent and passing the ID of the connection
    setInitiateAnimation(true);
    setTimeout(() => {
      handleReset();
      // the new connection will be displayed in the View Connections with chip stating ‘Pending'
      // and a toast message will be shown as well (setting a delay to wait for the animation to finish)
      dispatch(setCurrentOperation(toastState.connectionRequestPending));
    }, TOAST_MESSAGE_DELAY);
  };

  return (
    <IonPage
      className={`page-layout connection-request safe-area ${
        showConnectionRequest ? "show" : "hide"
      } ${initiateAnimation ? "animation-on" : "animation-off"}`}
      data-testid="connection-request"
    >
      <PageLayout
        footer={true}
        primaryButtonText={`${i18n.t("connectionrequest.button.connect")}`}
        primaryButtonAction={() => setAlertIsOpen(true)}
        secondaryButtonText={`${i18n.t("connectionrequest.button.cancel")}`}
        secondaryButtonAction={() => handleReset()}
      >
        <h2>{i18n.t("connectionrequest.title")}</h2>
        <IonGrid className="connection-request-content">
          <IonRow className="connection-request-icons-row">
            <div className="connection-request-user-logo">
              <IonIcon
                icon={personCircleOutline}
                color="light"
              />
            </div>
            <div className="connection-request-swap-logo">
              <span>
                <IonIcon icon={swapHorizontalOutline} />
              </span>
            </div>
            <div className="connection-request-checkmark-logo">
              <span>
                <IonIcon icon={checkmark} />
              </span>
            </div>
            <div className="connection-request-provider-logo">
              <img
                src={connectionData.profileUrl}
                alt="connection-request-provider-logo"
              />
            </div>
          </IonRow>
          <IonRow className="connection-request-info-row">
            <IonCol size="12">
              <span>
                {connectionData.goal_code + i18n.t("connectionrequest.request")}
              </span>
              <strong>{connectionData.label}</strong>
            </IonCol>
          </IonRow>
          <IonRow className="connection-request-status">
            <IonCol size="12">
              <strong>{i18n.t("connectionrequest.success")}</strong>
            </IonCol>
          </IonRow>
        </IonGrid>
      </PageLayout>
      <Alert
        isOpen={alertIsOpen}
        setIsOpen={setAlertIsOpen}
        dataTestId="alert-confirm"
        headerText={i18n.t("connectionrequest.alert.title")}
        confirmButtonText={`${i18n.t("connectionrequest.alert.confirm")}`}
        cancelButtonText={`${i18n.t("connectionrequest.alert.cancel")}`}
        actionConfirm={handleConnect}
        actionCancel={handleReset}
        actionDismiss={handleReset}
      />
    </IonPage>
  );
};

export { ConnectionRequest };