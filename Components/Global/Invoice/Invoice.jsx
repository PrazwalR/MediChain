import React from "react";
import { ethers } from "ethers";

const Invoice = ({ invoic, currency }) => {
  console.log(invoic);
  
  // Convert price from Wei to ETH for display
  const priceInEth = invoic?.price ? parseFloat(ethers.utils.formatEther(invoic.price)) : 0;
  const totalPrice = priceInEth * (invoic?.quantity || 0);
  
  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">Apps</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">Invoice</a>
          </li>
        </ol>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card mt-3">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th className="center">#</th>
                      <th>Item</th>
                      <th>EMAIL</th>
                      <th className="right">Unit Cost</th>
                      <th className="center">Qty</th>
                      <th className="right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="center">#M00-{invoic?.medicineId}</td>
                      <td className="left strong">{invoic?.medicine.name}</td>
                      <td className="left">{invoic?.medicine.email}</td>
                      <td className="right">
                        {priceInEth} {currency}
                      </td>
                      <td className="center">{invoic?.quantity}</td>
                      <td className="right">
                        {totalPrice.toFixed(6)} {currency}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="row">
                <div className="col-lg-4 col-sm-5" />
                <div className="col-xl-4 col-sm-7 ms-auto">
                  <table className="table table-clear">
                    <tbody>
                      <tr>
                        <td className="left">
                          <strong className="text-black">Subtotal</strong>
                        </td>
                        <td className="right">
                          {totalPrice.toFixed(6)} {currency}
                        </td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong className="text-black">Discount </strong>
                        </td>
                        <td className="right">{invoic?.medicine.discount}%</td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong className="text-black">VAT (0)</strong>
                        </td>
                        <td className="right">000.00</td>
                      </tr>
                      <tr>
                        <td className="left">
                          <strong className="text-black">Total</strong>
                        </td>
                        <td className="right">
                          <strong className="text-black">
                            {totalPrice.toFixed(6)} {currency}
                          </strong>
                          <br />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
