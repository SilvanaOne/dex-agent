"use client";

import { getChainId } from "./chain";
import { debug } from "./debug";
import { getSystemInfo } from "./system-info";
import { log } from "./log";
const DEBUG = debug();
const chainId = getChainId();

let walletInfo:
  | {
      address: string | undefined;
      network: string | undefined;
      isAuro: boolean | undefined;
    }
  | undefined;

export async function connectWallet(
  params: {
    openLink?: boolean;
  } = { openLink: true }
): Promise<{
  address: string | undefined;
  network: string | undefined;
  error: string | undefined;
  success: boolean;
}> {
  const { openLink } = params;

  let address = undefined;
  let network = undefined;
  const isAuro = (window as any).mina?.isAuro;
  const networkID = (window as any).mina?.chainInfo?.networkID;
  const logOptions = {
    networkID,
    isAuro,
  };

  if (DEBUG)
    console.log("connectWallet start", {
      mina: (window as any).mina,
      logOptions,
    });

  try {
    if (
      (window as any).mina !== undefined &&
      (window as any).mina?.requestNetwork !== undefined &&
      (window as any).mina?.requestAccounts !== undefined &&
      (window as any).mina?.switchChain !== undefined
    ) {
      let account;
      try {
        account = await (window as any).mina.requestAccounts();
      } catch (error: any) {
        log.error("connectWallet requestAccounts catch", { error, logOptions });
        console.error("connectWallet requestAccounts catch", error);
        return {
          address: undefined,
          network: undefined,
          error: `Auro Wallet error: ${
            error?.message ?? error ?? ""
          }, key: "requestAccounts"`,
          success: false,
        };
      }

      try {
        network = await (window as any).mina?.requestNetwork();
      } catch (error: any) {
        log.error("connectWallet requestNetwork catch", { error, logOptions });
        console.error("connectWallet requestNetwork catch", error);
        return {
          address: undefined,
          network: undefined,
          error: `Auro Wallet error: ${
            error?.message ?? error ?? ""
          }, key: "requestNetwork"`,
          success: false,
        };
      }
      if (DEBUG) console.log("connectWallet network", network);
      if (network?.networkID !== chainId) {
        let switchNetwork;
        try {
          switchNetwork = await (window as any).mina.switchChain({
            networkID: chainId,
          });
        } catch (error: any) {
          log.error("connectWallet switchChain catch", { error, logOptions });
          console.error("connectWallet switchChain catch", error);
          return {
            address: undefined,
            network: undefined,
            error: `Auro Wallet error: ${
              error?.message ?? error ?? ""
            }, key: "switchChain"`,
            success: false,
          };
        }

        if (DEBUG) console.log("connectWallet switch network", switchNetwork);
        try {
          network = await (window as any).mina.requestNetwork();
        } catch (error: any) {
          log.error("connectWallet requestNetwork 2 catch", {
            error,
            logOptions,
          });
          console.error("connectWallet requestNetwork 2 catch", error);
          return {
            address: undefined,
            network: undefined,
            error: `Auro Wallet error: ${
              error?.message ?? error ?? ""
            }, key: "requestNetwork 2"`,
            success: false,
          };
        }
      }
      if (DEBUG) console.log("connectWallet network", network);

      if (
        account &&
        Array.isArray(account) &&
        account.length > 0 &&
        network?.networkID === chainId
      )
        address = account[0];
      else {
        log.error("connectWallet account error", {
          account,
          network,
          logOptions,
        });
        console.error("connectWallet account error", { account, network });
        return {
          address: undefined,
          network: undefined,
          error: `Please use the last Auro Wallet version, connect your wallet and switch to the correct network, key: "minaLogin error"`,
          success: false,
        };
      }
    } else {
      if (openLink) {
        const { isAndroid, isIOS } = await getSystemInfo();
        const auroIOS = "https://apps.apple.com/app/auro-wallet/id6444288288";
        const auroAndroid =
          "https://play.google.com/store/apps/details?id=com.aurowallet.www.aurowallet";
        const auroExtension =
          "https://chrome.google.com/webstore/detail/auro-wallet/cnmamaachppnkjgnildpdmkaakejnhae";
        if (isAndroid) {
          window.open(auroAndroid, "_blank");
        } else if (isIOS) {
          window.open(auroIOS, "_blank");
        } else {
          window.open(auroExtension, "_blank");
        }
      }
    }
  } catch (error: any) {
    log.error("connectWallet catch", { error, logOptions });
    console.error("connectWallet catch", error);
    return {
      address: undefined,
      network: undefined,
      error: `Auro Wallet error: ${
        error?.message ?? error ?? ""
      }, key: "connectWallet"`,
      success: false,
    };
  }
  if (DEBUG) console.log("connectWallet: no address", address);
  if (!address) {
    log.warn("connectWallet: no address", { address, network, logOptions });
    return {
      address: undefined,
      network: undefined,
      error: "connectWallet: no address found",
      success: false,
    };
  }
  const result = {
    address,
    network: network?.networkID,
    isAuro: (window as any).mina?.isAuro === true,
    error: undefined,
    success: true,
  };
  if (
    !walletInfo ||
    walletInfo.address !== result.address ||
    walletInfo.network !== result.network ||
    walletInfo.isAuro !== result.isAuro
  ) {
    walletInfo = result;
    log.info("connectWallet", result);
  }
  return result;
}

export async function getWalletInfo(): Promise<{
  address: string | undefined;
  network: string | undefined;
  isAuro: boolean | undefined;
}> {
  let address: string | undefined;
  let network: string | undefined;

  try {
    const { mina } = window as any;
    if (!mina) {
      return {
        address: undefined,
        network: undefined,
        isAuro: undefined,
      };
    }

    try {
      const account = await mina.getAccounts();

      if (account.length > 0) {
        address = account[0];
      }
    } catch (error: any) {
      console.error("getWalletInfo catch on getAccounts", error);
    }

    try {
      network = (await (window as any).mina?.requestNetwork())?.networkID;
    } catch (error: any) {
      console.error("getWalletInfo requestNetwork catch", error);
    }
  } catch (error: any) {
    console.error("getWalletInfo catch", error);
  }

  const info = {
    address,
    network,
    isAuro: (window as any).mina?.isAuro === true,
  };
  if (
    !walletInfo ||
    walletInfo.address !== info.address ||
    walletInfo.network !== info.network ||
    walletInfo.isAuro !== info.isAuro
  ) {
    walletInfo = info;
    log.info("getWalletInfo", info);
  }
  return info;
}
