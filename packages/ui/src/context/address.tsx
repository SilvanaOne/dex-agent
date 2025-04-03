import React, { createContext, useState, useEffect } from "react";
import { getChainId } from "@/lib/chain";
import { getWalletInfo } from "@/lib/wallet";
const chainId = getChainId();

interface AddressProviderProps {
  children: React.ReactNode;
}

interface AddressContextType {
  address: string | undefined;
  setAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const AddressContext = createContext<AddressContextType>({
  address: undefined,
  setAddress: () => {},
});

export const AddressProvider: React.FC<AddressProviderProps> = ({
  children,
}) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);

  function addressChanged(accounts: string[]) {
    setAddress(accounts.length > 0 ? accounts[0] : undefined);
  }

  async function networkChanged(network: { networkID: string }) {
    if (network.networkID !== chainId) {
      setAddress(undefined);
    } else {
      setAddress((await getWalletInfo()).address);
    }
  }

  function initialize() {
    if (initialized) return;
    (window as any).mina?.on("accountsChanged", addressChanged);
    (window as any).mina?.on("chainChanged", networkChanged);
    setInitialized(true);
  }

  useEffect(() => {
    initialize();
  }, []);

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
