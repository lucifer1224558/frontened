"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function BilledHistoryPage() {
  const { paidBills = [], refreshPaidBills, deleteBill } = useCart() || {};

  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");

  useEffect(() => {
    if (refreshPaidBills) {
      refreshPaidBills();
    }
  }, [refreshPaidBills]);

  // ✅ Safe Filtering
  const filteredHistory = Array.isArray(paidBills)
    ? paidBills.filter((bill: any) => {
        const matchesBillNo = (bill?.orderNo || bill?._id || bill?.id || "")
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        const billDate = bill?.createdAt
          ? new Date(bill.createdAt).toISOString().split("T")[0]
          : "";

        const matchesDate = searchDate ? billDate === searchDate : true;

        return matchesBillNo && matchesDate;
      })
    : [];

  const handleDelete = (id: string) => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to delete this bill from history?")) {
      deleteBill?.(id);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="billing-container">
      <header className="billing-header">
        <div>
          <h1>Billed History</h1>
          <p>Review and manage all finalized guest bills</p>
        </div>

        <div className="billing-search-group">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search Bill No..."
              className="billing-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="search-input-wrapper">
            <input
              type="date"
              className="billing-date-input"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>

          {(searchTerm || searchDate) && (
            <button
              className="btn-clear-filters"
              onClick={() => {
                setSearchTerm("");
                setSearchDate("");
              }}
            >
              Clear
            </button>
          )}
        </div>
      </header>

      <div className="bills-grid">
        {filteredHistory.length === 0 ? (
          <div className="empty-bills">
            <p>
              {searchTerm || searchDate
                ? "No results match your search"
                : "No billed history found"}
            </p>
          </div>
        ) : (
          filteredHistory.map((bill: any) => (
            <div key={bill?._id || bill?.id} className="bill-card">
              <div className="bill-header-row">
                <div>
                  <strong>
                    #{bill?.orderNo || bill?._id?.slice(-6) || "N/A"}
                  </strong>
                  <div>
                    {bill?.createdAt
                      ? new Date(bill.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>

                <div>
                  <span>Table: {bill?.tableNo || "N/A"}</span>
                </div>
              </div>

              {/* ✅ Safe Items Mapping */}
              <div>
                {(bill?.items || []).map((item: any, idx: number) => (
                  <div key={idx}>
                    {item?.quantity} x {item?.name} — ₹
                    {(item?.price * item?.quantity || 0).toFixed(2)}
                  </div>
                ))}
              </div>

              <div>
                <div>Payment: {bill?.paymentMethod || "Cash"}</div>
                <div>GST: {bill?.gst || 18}%</div>
                <div>
                  Total: ₹
                  {(bill?.totalAmount || bill?.total || 0).toFixed(2)}
                </div>
              </div>

              <div>
                <button onClick={handlePrint}>Reprint</button>
                <button
                  onClick={() =>
                    handleDelete((bill?._id || bill?.id || "").toString())
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}