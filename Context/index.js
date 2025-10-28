import React, { useState, useContext, createContext, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Web3 from "web3";
import toast from "react-hot-toast";
//INTERNAL IMPORT
import {
  HANDLE_NETWORK_SWITCH,
  SHORTEN_ADDRESS,
  HEALTH_CARE_CONTARCT,
  GET_WEB3_CONTRACT,
  PINATA_AIP_KEY,
  PINATA_SECRECT_KEY,
  UPLOAD_METADATA,
  PARSED_ERROR_MSG,
  GET_ALL_APPROVE_DOCTORS,
} from "./constants";
import Healthcare from "./Healthcare.json";

const DOCTOR_REGISTER_FEE = process.env.NEXT_PUBLIC_DOCTOR_REGISTER_FEE;
const PATIENT_APOINMENT_FEE = process.env.NEXT_PUBLIC_PATIENT_APPOINMENT_FEE;
const PATIENT_REGISTER_FEE = process.env.NEXT_PUBLIC_PATIENT_REGISTER_FEE;
const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;
const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  //STATE VERIABLE
  const [address, setAddress] = useState();
  const [accountBalance, setAccountBalance] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reCall, setReCall] = useState(0);
  const [currency, setCurrency] = useState(CURRENCY);
  const [openComponent, setOpenComponent] = useState("Home");
  const [registerDoctors, setRegisterDoctors] = useState();
  const [registeredPatient, setRegisteredPatient] = useState();

  const notifySuccess = (msg) => toast.success(msg, { duration: 2000 });
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  //CHECK WALLET CONNECT
  const CHECKI_IF_CONNECTED_LOAD = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");
      
      // Switch network first
      await HANDLE_NETWORK_SWITCH();
      
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (accounts.length) {
        setAddress(accounts[0]);
        
        // Use direct RPC provider to avoid ENS issues
        try {
          const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/eth_holesky");
          const getBalance = await provider.getBalance(accounts[0]);
          const bal = ethers.utils.formatEther(getBalance);
          setAccountBalance(bal);
        } catch (balanceError) {
          // If balance check fails, continue without it
          console.log("Balance check failed:", balanceError);
          setAccountBalance("0");
        }
        
        return accounts[0];
      } else {
        return "No account";
      }
    } catch (error) {
      console.error("Connection load error:", error);
      return "not connected";
    }
  };

  //CONNECT WALLET
  const CONNECT_WALLET = async () => {
    try {
      if (!window.ethereum) return console.log("Install MetaMask");
      
      // Switch network first
      await HANDLE_NETWORK_SWITCH();
      
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const firstAccount = accounts[0];

      setAddress(firstAccount);
      return firstAccount;
    } catch (error) {
      console.error("Wallet connection error:", error);
      throw error;
    }
  };

  useEffect(() => {
    CHECKI_IF_CONNECTED_LOAD();
  }, []);

  //-------MEDICINE------------

  //ADD MEDICINE
  const ADD_MEDICINE = async (medicine) => {
    try {
      const {
        verifyingDoctor,
        name,
        brand,
        manufacturer,
        manufacturDate,
        expiryDate,
        code,
        companyEmail,
        discount,
        manufactureAddress,
        price,
        quentity,
        currentLocation,
        mobile,
        email,
        image,
        description,
      } = medicine;
      if (
        !verifyingDoctor ||
        !name ||
        !brand ||
        !manufacturer ||
        !manufacturDate ||
        !expiryDate ||
        !code ||
        !companyEmail ||
        !discount ||
        !manufactureAddress ||
        !price ||
        !quentity ||
        !currentLocation ||
        !mobile ||
        !email ||
        !image ||
        !description
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const data = JSON.stringify({
        verifyingDoctor: verifyingDoctor,
        name: name,
        brand: brand,
        manufacturer: manufacturer,
        manufacturDate: manufacturDate,
        expiryDate: expiryDate,
        code: code,
        companyEmail: companyEmail,
        discount: discount,
        manufactureAddress: manufactureAddress,
        price: price,
        quentity: quentity,
        currentLocation: currentLocation,
        mobile: mobile,
        email: email,
        image: image,
        description: description,
      });

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _IPFS_URL = await UPLOAD_METADATA(data);

        const transaction = await contract.ADD_MEDICINE(
          _IPFS_URL,
          price,
          quentity,
          discount,
          currentLocation,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Medicine Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_LOCATION
  const UPDATE_MEDICINE_LOCATION = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating medicine location... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_LOCATION(
          Number(medicineID),
          update,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Location updated successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_PRICE
  const UPDATE_MEDICINE_PRICE = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new price... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_PRICE(
          Number(medicineID),
          Number(update),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Price updated successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_QUANTITY
  const UPDATE_MEDICINE_QUANTITY = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new quantity... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_QUANTITY(
          Number(medicineID),
          Number(update),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("quantity updated successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_DISCOUNT
  const UPDATE_MEDICINE_DISCOUNT = async (updateMedicine) => {
    const { medicineID, update } = updateMedicine;
    try {
      if (!medicineID || !update) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new discount... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_DISCOUNT(
          Number(medicineID),
          Number(update),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("discount updated successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // UPDATE_MEDICINE_ACTIVE
  const UPDATE_MEDICINE_ACTIVE = async (_medicineId) => {
    try {
      if (!_medicineId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Updating new status... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_MEDICINE_ACTIVE(
          Number(_medicineId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Status updated successfully");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //-------END MEDICINE-----------

  ///REGISTER DOCTOR
  const ADD_DOCTOR = async (doctor) => {
    try {
      const {
        title,
        firstName,
        lastName,
        gender,
        degrer,
        yourAddress,
        designation,
        lastWork,
        mobile,
        emailID,
        collageName,
        collageID,
        joiningYear,
        endYear,
        specialization,
        registrationID,
        collageAddress,
        walletAddress,
        image,
        biography,
      } = doctor;
      if (
        !title ||
        !firstName ||
        !lastName ||
        !gender ||
        !degrer ||
        !yourAddress ||
        !designation ||
        !lastWork ||
        !mobile ||
        !emailID ||
        !collageName ||
        !collageID ||
        !joiningYear ||
        !endYear ||
        !specialization ||
        !registrationID ||
        !collageAddress ||
        !walletAddress ||
        !image ||
        !biography
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const data = JSON.stringify({
        title: title,
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        degrer: degrer,
        yourAddress: yourAddress,
        designation: designation,
        lastWork: lastWork,
        mobile: mobile,
        emailID: emailID,
        collageName: collageName,
        collageID: collageID,
        joiningYear: joiningYear,
        endYear: endYear,
        specialization: specialization,
        registrationID: registrationID,
        collageAddress: collageAddress,
        walletAddress: walletAddress,
        image: image,
        biography: biography,
      });

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.registrationDoctorFee();

        const _IPFS_URL = await UPLOAD_METADATA(data);

        const accountName = `${title} ${firstName} ${lastName}`;

        const _type = "Doctor";

        const transaction = await contract.ADD_DOCTOR(
          _IPFS_URL,
          walletAddress,
          accountName,
          _type,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  // DOCTOR APPROVE
  const APPROVE_DOCTOR_STATUS = async (_doctorId) => {
    try {
      if (!_doctorId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations Approve is processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.APPROVE_DOCTOR_STATUS(
          Number(_doctorId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations Approve conplete");
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //PRESCRIBE PATIENT MEDICINE
  const PRESCRIBE_MEDICINE = async (prescribeDoctor) => {
    try {
      const { medicineID, patientID } = prescribeDoctor;
      if (!medicineID || !patientID) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.PRESCRIBE_MEDICINE(
          Number(medicineID),
          Number(patientID),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPDATE_PATIENT_MEDICAL_HISTORY
  const UPDATE_PATIENT_MEDICAL_HISTORY = async (conditionUpdate) => {
    try {
      const { message, patientID } = conditionUpdate;
      if (!patientID || !message) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_PATIENT_MEDICAL_HISTORY(
          Number(patientID),
          message,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //COMPLETE APPOINMENT
  const COMPLETE_APPOINTMENT = async (_appointmentId) => {
    try {
      if (!_appointmentId) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.COMPLETE_APPOINTMENT(
          Number(_appointmentId),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //------APTIENT-------

  ///ADD PATIENT - Web3.js Implementation (ENS-Free)
  const ADD_PATIENTS = async (patient, doctor) => {
    try {
      const doctorAddress = doctor?.accountAddress;
      const doctorName = `${doctor?.title} ${doctor?.firstName} ${doctor?.lastName}`;

      const {
        title,
        firstName,
        lastName,
        gender,
        medicialHistory,
        yourAddress,
        mobile,
        emailID,
        birth,
        walletAddress,
        image,
        message,
        city,
      } = patient;
      
      if (
        !title ||
        !firstName ||
        !lastName ||
        !gender ||
        !medicialHistory ||
        !yourAddress ||
        !mobile ||
        !emailID ||
        !birth ||
        !walletAddress ||
        !image ||
        !message ||
        !city ||
        !doctorName ||
        !doctorAddress
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registration processing... ");

      // Ensure MetaMask is available
      if (!window.ethereum) {
        setLoader(false);
        return notifyError("Please install MetaMask");
      }

      try {
        // First ensure we're on the correct network
        await HANDLE_NETWORK_SWITCH();
        
        // Initialize Web3 with MetaMask provider
        const web3 = new Web3(window.ethereum);
        
        // Get current accounts
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        
        if (!accounts.length) {
          setLoader(false);
          return notifyError("Please connect your wallet");
        }

        const account = accounts[0];
        setAddress(account);

        // Prepare metadata
        const data = JSON.stringify({
          title: title,
          firstName: firstName,
          lastName: lastName,
          gender: gender,
          medicialHistory: medicialHistory,
          yourAddress: yourAddress,
          mobile: mobile,
          emailID: emailID,
          birth: birth,
          doctorName: doctorName,
          doctorAddress: doctorAddress,
          walletAddress: walletAddress,
          image: image,
          message: message,
          city: city,
        });

        // Upload metadata to IPFS first
        const _IPFS_URL = await UPLOAD_METADATA(data);
        console.log("IPFS Upload complete:", _IPFS_URL);

        // Create contract instance with Web3.js
        const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_HEALTH_CARE;
        const contract = new web3.eth.Contract(Healthcare.abi, CONTRACT_ADDRESS);

        // Get registration fee
        const _fee = await contract.methods.registrationPatientFee().call();
        console.log("Registration fee:", _fee);

        // Prepare transaction parameters
        const accountName = `${title} ${firstName} ${lastName}`;
        const _type = "Patient";

        console.log("Sending registration transaction...");
        
        // Send transaction using Web3.js (completely bypasses ENS)
        const result = await contract.methods.ADD_PATIENTS(
          _IPFS_URL,
          [medicialHistory],
          walletAddress,
          [0],
          accountName,
          doctorAddress,
          doctorName,
          _type
        ).send({
          from: account,
          value: _fee,
          gas: 8000000,
        });

        console.log("Transaction result:", result);

        if (result.transactionHash) {
          setLoader(false);
          notifySuccess("Patient registration successful!");
          window.location.reload();
        }
        
      } catch (contractError) {
        setLoader(false);
        console.error("Contract error:", contractError);
        
        // Handle specific error types
        if (contractError.message.includes("User denied")) {
          notifyError("Transaction cancelled by user");
        } else if (contractError.message.includes("insufficient funds")) {
          notifyError("Insufficient funds for transaction");
        } else if (contractError.message.includes("execution reverted")) {
          notifyError("Registration failed - patient may already be registered");
        } else {
          const errorMsg = PARSED_ERROR_MSG(contractError);
          notifyError(errorMsg || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      setLoader(false);
      console.error("Registration error:", error);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg || "Registration failed. Please try again.");
    }
  };

  ///BOOK APPOINMENT
  const BOOK_APPOINTMENT = async (booking, bookingDoctor) => {
    try {
      const { from, to, appointmentDate, condition, message } = booking;
      console.log(from, to, appointmentDate, condition, message);
      const { accountAddress, title, firstName, lastName, doctorID } =
        bookingDoctor;

      if (
        !from ||
        !to ||
        !appointmentDate ||
        !condition ||
        !message ||
        !accountAddress
      )
        return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _fee = await contract.appointmentFee();
        const _patientID = await contract.GET_PATIENT_ID(address);

        const transaction = await contract.BOOK_APPOINTMENT(
          _patientID.toNumber(),
          Number(doctorID),
          from,
          to,
          appointmentDate,
          condition,
          message,
          accountAddress,
          `${title} ${firstName} ${lastName}`,
          {
            value: _fee.toString(),
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //BUY MEDICINE
  const BUY_MEDICINE = async (_medicineId, _price, _quantity) => {
    try {
      if (!_medicineId || !_quantity) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registration processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const _patientID = await contract.GET_PATIENT_ID(address);

        const price = _price * Number(_quantity);

        const parsedAmount = ethers.utils.parseEther(price.toString());

        const paymentHash = await ethereum.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: address,
              to: ADMIN_ADDRESS,
              gas: "0x5208",
              value: parsedAmount._hex,
            },
          ],
        });

        const transaction = await contract.BUY_MEDICINE(
          _patientID.toNumber(),
          Number(_medicineId),
          Number(_quantity),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      const msg = PARSED_ERROR_MSG(error);
      console.log(msg);
      console.log(error);
    }
  };
  ///CHAT
  const SEND_MESSAGE = async (activeChat, messageChat) => {
    try {
      const { name, userAddress } = activeChat;
      const { message } = messageChat;

      if (!message || !userAddress) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract._SEND_MESSAGE(
          userAddress,
          address,
          message,
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          setReCall(reCall + 1);
        }
      }
    } catch (error) {
      setLoader(false);
      notifyError("Something went wrong");
      console.log(error);
    }
  };

  //-----ADMIN--------

  //UPADTE REGSITRATION FEE
  const UPDATE_REGISTRATION_DOCTOR_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_REGISTRATION_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPADTE APPOINMENT FEE
  const UPDATE_APPOINTMENT_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_APPOINTMENT_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPADTE PATIENT_REGISTRATION FEE
  const UPDATE_REGISTRATION_PATIENT_FEE = async (_newFee) => {
    try {
      if (!_newFee) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_REGISTRATION_PATIENT_FEE(
          ethers.utils.parseEther(_newFee),
          {
            gasLimit: ethers.utils.hexlify(8000000),
          }
        );

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  //UPDATE_ADMIN_ADDRESS
  const UPDATE_ADMIN_ADDRESS = async (_newAddress) => {
    try {
      if (!_newAddress) return notifyError("Data missing");

      setLoader(true);
      notifySuccess("Registrations processing... ");

      const address = await CHECKI_IF_CONNECTED_LOAD();
      if (address) {
        const contract = await HEALTH_CARE_CONTARCT();

        const transaction = await contract.UPDATE_ADMIN_ADDRESS(_newAddress, {
          gasLimit: ethers.utils.hexlify(8000000),
        });

        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registrations conplete");
          window.location.reload();
        }
      }
    } catch (error) {
      setLoader(false);
      const errorMsg = PARSED_ERROR_MSG(error);
      notifyError(errorMsg);
      console.log(error);
    }
  };

  return (
    <StateContext.Provider
      value={{
        UPDATE_ADMIN_ADDRESS,
        UPDATE_REGISTRATION_PATIENT_FEE,
        UPDATE_APPOINTMENT_FEE,
        UPDATE_REGISTRATION_DOCTOR_FEE,
        CHECKI_IF_CONNECTED_LOAD,
        CONNECT_WALLET,
        //ADD MEDICINE
        ADD_MEDICINE,
        UPDATE_MEDICINE_ACTIVE,
        UPDATE_MEDICINE_DISCOUNT,
        UPDATE_MEDICINE_LOCATION,
        UPDATE_MEDICINE_PRICE,
        UPDATE_MEDICINE_QUANTITY,
        //ADD DOCOTR
        ADD_DOCTOR,
        APPROVE_DOCTOR_STATUS,
        ADD_PATIENTS,
        PRESCRIBE_MEDICINE,

        UPDATE_PATIENT_MEDICAL_HISTORY,
        BOOK_APPOINTMENT,
        COMPLETE_APPOINTMENT,
        SEND_MESSAGE,
        BUY_MEDICINE,
        //VERIBALES
        notifySuccess,
        notifyError,
        setLoader,
        setAddress,
        setAccountBalance,
        setOpenComponent,
        openComponent,
        currency,
        address,
        loader,
        accountBalance,
        reCall,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
