import React, { useEffect, useState } from "react";
import './styles.css';
import { connectWallet, setup } from "./library/hospitalConnect";
import { getValue, reqVacc } from "./library/hospitalInteract";

const Hospital = () => {
  const [Tezos, setTezos] = useState(undefined);
  const [status, setStatus] = useState("No Operations Performed");
  const [value, setValue] = useState(0);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    console.log("run");
    setup().then(setTezos).catch(console.error);
  }, []);

  useEffect(() => {
    if (Tezos === undefined) return;
    getValue(Tezos)
      .then(setValue)
      .then(() => setLoader(false))
      .catch(console.error);
    const timer = setInterval(() => {
      getValue(Tezos).then(setValue).catch(console.error);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [Tezos]);

  const handleEvent = async (e, func, params) => {
    e.preventDefault();
    try {
      const wal = await connectWallet();
      Tezos.setWalletProvider(wal);
      setLoader(true);
      await func(Tezos, params, setStatus);
      await getValue(Tezos)
        .then(setValue)
        .then(() => setLoader(false));
    } catch (err) {
      console.error(err);
      alert("Couldn't connect wallet");
    }
  };

  return (
    <div className="Hospital">
      <p>Performing Operations as: <strong>Gov Hospital</strong> </p>
      <div class = "counter">
        <h4>Vaccines Available in Hospital's Inventory - </h4>
        {!loader && <div className="value">{value}</div>}
        {loader && <Loader />}
      </div>
      <h3>Request Vaccines from: State Government</h3>
      <form
        onSubmit={async (e) => {
          await handleEvent(e, reqVacc, {
            address: e.target.address.value,
            amtVaccine: e.target.amtVaccine.value,
          });
        }}
      >
        <input type="string" name="address" step="1" placeholder="Hash Address of the State"/>
        <input type="number" name="amtVaccine" step="1" placeholder="Units of Vaccines to be Requested"/>
        <input type="submit" className="submitBtn" value="Transfer Vaccine" />
      </form>
      <p className="hiddenText" dangerouslySetInnerHTML={{ __html: "Tx Status : " + status }}></p>
    </div>
  );
};

const Loader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      style={{
        display: "block",
      }}
      width="3vw"
      height="3vw"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#cc085a"
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
        ></animateTransform>
      </circle>
    </svg>
  );
};

export default Hospital;
