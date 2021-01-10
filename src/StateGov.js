import React, { useEffect, useState } from "react";
import "./styles.css";
import { connectWallet, setup } from "./library/stateConnect";
import { getValue, transferHosp, vaccReq } from "./library/stateInteract";

const StateGov = () => {
  const [Tezos, setTezos] = useState(undefined);
  const [status, setStatus] = useState("No Operations Performed");
  const [value, setValue] = useState(0);
  const [loader, setLoader] = useState(true);
  // const [toggler, setToggler] = useState(false);

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
    <div className="StateGov">
      <p>Performing Operations as: <strong>State Government</strong> </p>
      <div class = "counter">
        <h4>Vaccines Available with State Government - </h4>
        {!loader && <div className="value">{value}</div>}
        {loader && <Loader />}
      </div>
      
      <h3>Transfer Vaccines to: State Gov Hospitals</h3>
      <form
        onSubmit={async (e) => {
          await handleEvent(e, transferHosp, {
            address: e.target.address.value,
            amtVaccine: e.target.amtVaccine.value,
          });
        }}
      >
        <input type="string" name="address" step="1" placeholder="Hash Address of the hospital" />
        <input type="number" name="amtVaccine" step="1" placeholder="Units of Vaccines to be Sent"/>
        <input type="submit" className="submitBtn" value="Transfer Vaccine" />
      </form>

      <h3>Request Vaccines from Central Government</h3>
      <form
        onSubmit={async (e) => {
          await handleEvent(e, vaccReq, {
            address: e.target.address.value,
            amtVaccine: e.target.amtVaccine.value,
          });
        }}
      >
        <input type="string" name="address" step="1" placeholder="Hash Address of the Central Government" />
        <input type="number" name="amtVaccine" step="1" placeholder="Units of Vaccines to be Requested"/>
        <input type="submit" className="submitBtn" value="Request Vaccine" />
      </form>
      {/* <div 
        className="requestsContainer"
        style={{visibility: toggler ? 'visible' : 'hidden' }}
        >
          <h5>KT1WtRewpx8Fv7J5HG9UKfLvrosyqZ9xeajL requested 38 units of Vaccine.</h5>
      </div>
      <button 
        className="requestBtn"
        onClick={
          async (e) => {
            setToggler(!toggler)
          }
        }
      >Reveal Vaccine requests from the Hospitals</button> */}
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

export default StateGov;
