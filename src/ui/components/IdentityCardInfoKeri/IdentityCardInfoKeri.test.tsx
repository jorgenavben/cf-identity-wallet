import { fireEvent, render, waitFor } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { Clipboard } from "@capacitor/clipboard";
import { keriFix, identityFix } from "../../__fixtures__/identityFix";
import { TabsRoutePath } from "../../components/navigation/TabsMenu";
import { FIFTEEN_WORDS_BIT_LENGTH } from "../../../constants/appConstants";
import { filteredKeriFix } from "../../__fixtures__/filteredIdentityFix";
import { DidCardDetails } from "../../pages/DidCardDetails";
import { AriesAgent } from "../../../core/aries/ariesAgent";
import { formatShortDate, formatTimeToSec } from "../../../utils";

const path = TabsRoutePath.DIDS + "/" + identityFix[1].id;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    id: identityFix[1].id,
  }),
  useRouteMatch: () => ({ url: path }),
}));

jest.mock("../../../core/aries/ariesAgent", () => ({
  AriesAgent: {
    agent: {
      getIdentity: jest
        .fn()
        .mockResolvedValue({ type: "keri", result: identityFix[1] }),
    },
  },
}));

const mockStore = configureStore();
const dispatchMock = jest.fn();
const initialState = {
  stateCache: {
    routes: [TabsRoutePath.DIDS],
    authentication: {
      loggedIn: true,
      time: Date.now(),
      passcodeIsSet: true,
      passwordIsSet: true,
    },
  },
  seedPhraseCache: {
    seedPhrase160:
      "example1 example2 example3 example4 example5 example6 example7 example8 example9 example10 example11 example12 example13 example14 example15",
    seedPhrase256: "",
    selected: FIFTEEN_WORDS_BIT_LENGTH,
  },
  identitiesCache: {
    identities: filteredKeriFix,
  },
};

const storeMocked = {
  ...mockStore(initialState),
  dispatch: dispatchMock,
};

const storeMocked2 = {
  ...mockStore({ ...initialState }),
  dispatch: jest.fn(),
};

describe("Cards Details page", () => {
  test("It renders Keri Card Details", async () => {
    const { getByText, getByTestId, getAllByTestId } = render(
      <Provider store={storeMocked}>
        <MemoryRouter initialEntries={[path]}>
          <Route
            path={path}
            component={DidCardDetails}
          />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() =>
      expect(getByText(filteredKeriFix[0].id)).toBeInTheDocument()
    );
    expect(getByText(filteredKeriFix[0].displayName)).toBeInTheDocument();
    expect(getByTestId("share-identity-modal").getAttribute("is-open")).toBe(
      "false"
    );
    expect(getByTestId("identity-options-modal").getAttribute("is-open")).toBe(
      "false"
    );
    expect(getAllByTestId("verify-password")[0].getAttribute("is-open")).toBe(
      "false"
    );
    expect(AriesAgent.agent.getIdentity).toBeCalledWith(filteredKeriFix[0].id);
  });

  test("It copies delegator identifier, signing key, next key digest, backer address to clipboard", async () => {
    Clipboard.write = jest.fn();
    const { getByTestId } = render(
      <Provider store={storeMocked}>
        <MemoryRouter initialEntries={[path]}>
          <Route
            path={path}
            component={DidCardDetails}
          />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() =>
      expect(getByTestId("delegator-copy-button")).toBeInTheDocument()
    );

    fireEvent.click(getByTestId("delegator-copy-button"));

    await waitFor(() => {
      expect(Clipboard.write).toHaveBeenCalledWith({
        string: keriFix[0].di,
      });
    });

    fireEvent.click(getByTestId("signing-keys-list-copy-button-0"));
    await waitFor(() => {
      expect(Clipboard.write).toHaveBeenCalledWith({
        string: keriFix[0].k[0],
      });
    });

    fireEvent.click(getByTestId("next-keys-list-copy-button-0"));
    await waitFor(() => {
      expect(Clipboard.write).toHaveBeenCalledWith({
        string: keriFix[0].n[0],
      });
    });
  });

  test("It shows: Keys Signing Threshold - Next Keys Signing Threshold - Creation Timestamp - Last Key Rotation Timestamp - Sequence Number", async () => {
    const { getByText } = render(
      <Provider store={storeMocked2}>
        <MemoryRouter initialEntries={[path]}>
          <Route
            path={path}
            component={DidCardDetails}
          />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(getByText(keriFix[0].id)).toBeInTheDocument());
    await waitFor(() => expect(getByText(keriFix[0].kt)).toBeInTheDocument());
    await waitFor(() => expect(getByText(keriFix[0].nt)).toBeInTheDocument());
    await waitFor(() =>
      expect(
        getByText(
          formatShortDate(keriFix[0].createdAtUTC) +
            " - " +
            formatTimeToSec(keriFix[0].createdAtUTC)
        )
      ).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(
        getByText(
          formatShortDate(keriFix[0].dt) +
            " - " +
            formatTimeToSec(keriFix[0].dt)
        )
      ).toBeInTheDocument()
    );
    await waitFor(() => expect(getByText(keriFix[0].s)).toBeInTheDocument());
  });
});