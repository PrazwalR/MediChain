import React from "react";

const Card = ({
  title,
  patient,
  number,
  iconOne,
  iconTwo,
  classStyle,
  handleClick,
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && handleClick && handleClick(true)}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.3s ease",
      }}
    >
      <div className={`card gradient-bx text-white ${classStyle} ${disabled ? 'disabled-card' : ''}`}>
        <div className="card-body auth-width">
          {disabled && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                 style={{ background: "rgba(0,0,0,0.3)", zIndex: 1, borderRadius: "inherit" }}>
              <span className="text-white fw-bold">🔒 Connect Wallet First</span>
            </div>
          )}
          <div className="media align-items-center">
            <div className="media-body">
              <p className="mb-1">{title}</p>
              <div className="d-flex flex-wrap">
                <h2 className="fs-40 font-w600 text-white mb-0 me-3">
                  {patient}
                </h2>
                <div>
                  {iconOne}
                  <div className="fs-14">+{number}%</div>
                </div>
              </div>
            </div>
            <span className="border rounded-circle p-4">{iconTwo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
