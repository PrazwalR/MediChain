import React from "react";

import {
  HeroCard1,
  HeroCard2,
  HeroCard3,
  HeroCard4,
  HeroCard5,
  HeroCard6,
  HeroCard7,
  HeroCard8,
} from "../../SVG/index";
import { FaArrowRightLong } from "../../ReactICON/index";
import Card from "./Card";
import Steps from "./Steps";

const Auth = ({
  setAddDocotr,
  setAddPatient,
  address,
  connectMetaMask,
  SHORTEN_ADDRESS,
}) => {
  return (
    <div className="auth-modal">
      <div className="authincation h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-md-6">
              <div className="authincation-content">
                <div className="row no-gutters">
                  <div className="col-xl-12">
                    <div className="auth-form">
                      <div className="text-center mb-3">
                        <div style={{
                          fontSize: "2rem",
                          fontWeight: "bold",
                          color: "#0d6efd",
                          marginBottom: "1rem"
                        }}>
                          MediChain
                        </div>
                      </div>
                      <Steps />

                      {/* Connect Wallet Section */}
                      {!address && (
                        <div className="text-center mb-4">
                          <button
                            onClick={connectMetaMask}
                            className="btn btn-primary btn-lg px-5"
                            style={{
                              background: "linear-gradient(45deg, #0d6efd, #4a90e2)",
                              border: "none",
                              borderRadius: "10px",
                              fontWeight: "600",
                              boxShadow: "0 4px 15px rgba(13, 110, 253, 0.3)"
                            }}
                          >
                            🔗 Connect Wallet to Continue
                          </button>
                          <p className="text-muted mt-2 small">
                            Please connect your wallet to register as a patient or doctor
                          </p>
                        </div>
                      )}

                      <Card
                        handleClick={address ? setAddPatient : null}
                        title={"Patient Registration"}
                        patient={"100k +"}
                        number={"40"}
                        iconOne={<HeroCard1 />}
                        iconTwo={<HeroCard2 />}
                        classStyle={"bg-primary"}
                        disabled={!address}
                      />
                      <Card
                        handleClick={address ? setAddDocotr : null}
                        title={"Doctor Registration"}
                        patient={"100 +"}
                        number={"14"}
                        iconOne={<HeroCard1 />}
                        iconTwo={<HeroCard4 />}
                        classStyle={"bg-info"}
                        disabled={!address}
                      />
                      <div className="new-account mt-3">
                        <p className="mb-0">
                          Welcome to{" "}
                          <a className="text-primary">
                            MediChain: Your Health, Our Priority
                          </a>{" "}
                          where compassionate care meets exceptional medical
                          expertise. <FaArrowRightLong />
                          <a
                            className="text-primary"
                            onClick={() => (address ? "" : connectMetaMask())}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            &nbsp;
                            {address
                              ? `${SHORTEN_ADDRESS(address)}`
                              : "Connect Wallet"}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
