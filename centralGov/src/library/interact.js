import * as config from "./config.json";

export const transferVaccine = (Tezos, {address, reqVaccine}, setStatus) =>
  Tezos.wallet
    .at(config.contractAddr)
    .then((contract) => {
      return contract.methods.transferVaccine(address, reqVaccine).send();
    })
    .then((op) => {
      setStatus(`Awaiting to be confirmed..`);
      return op.confirmation(1).then(() => op.opHash);
    })
    .then((hash) =>
      setStatus(
        `Operation injected: <a target="#" href="https://delphinet.tzkt.io/${hash}">check here</a>`
      )
    );

export const getValue = (Tezos) =>
  Tezos.wallet
    .at(config.contractAddr)
    .then((contract) => contract.storage())
    .then((storage) => {
      return storage.vaccineAvailable.toString();
    });
