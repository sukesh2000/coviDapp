import * as config from "./config.json";

export const reqVacc = (Tezos, {address, amtVaccine}, setStatus) =>
  Tezos.wallet
    .at(config.contractAddr)
    .then((contract) => {
      return contract.methods.reqVacc(address, amtVaccine).send();
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
      return storage.toString();
    });
