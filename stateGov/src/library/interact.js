import * as config from "./config.json";

export const transferHosp = (Tezos, {address, amtVaccine}, setStatus) =>
  Tezos.wallet
    .at(config.contractAddr)
    .then((contract) => {
      return contract.methods.transferHosp(address, amtVaccine).send();
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

    export const vaccReq = (Tezos, {address, amtVaccine}, setStatus) =>
    Tezos.wallet
      .at(config.contractAddr)
      .then((contract) => {
        return contract.methods.vaccReq(address, amtVaccine).send();
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

// export const multiply = (Tezos, value, setStatus) =>
//   Tezos.wallet
//     .at(config.contractAddr)
//     .then((contract) => {
//       return contract.methods.multiply(value).send();
//     })
//     .then((op) => {
//       setStatus(`Awaiting to be confirmed..`);
//       return op.confirmation(1).then(() => op.opHash);
//     })
//     .then((hash) =>
//       setStatus(
//         `Operation injected: <a target="#" href="https://delphinet.tzkt.io/${hash}">check here</a>`
//       )
//     );
// export const add = (Tezos, { a, b }, setStatus) =>
//   Tezos.wallet
//     .at(config.contractAddr)
//     .then((contract) => {
//       return contract.methods.add(a, b).send();
//     })
//     .then((op) => {
//       setStatus(`Awaiting to be confirmed..`);
//       return op.confirmation(1).then(() => op.opHash);
//     })
//     .then((hash) =>
//       setStatus(
//         `Operation injected: <a target="#" href="https://delphinet.tzkt.io/${hash}">check here</a>`
//       )
//     );

export const getValue = (Tezos) =>
  Tezos.wallet
    .at(config.contractAddr)
    .then((contract) => contract.storage())
    .then((storage) => {
      return storage.vaccineCount.toString();
    });
