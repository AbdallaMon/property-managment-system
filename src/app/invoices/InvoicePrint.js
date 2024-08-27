import React, { forwardRef } from "react";
import { PaymentType } from "@/app/constants/Enums";
import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic";

const InvoicePrint = forwardRef(({ invoice }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        padding: "20px",
        width: "210mm", // A4 width
        maxWidth: "210mm",
        marginTop: "20px",
        margin: "auto",
        direction: "rtl",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        lineHeight: 1.6,
        color: "#333",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: "0", fontSize: "24px", color: "#2c3e50" }}>
          فاتورة
        </h1>
        <div
          style={{ fontSize: "18px", fontWeight: "bold", marginTop: "10px" }}
        >
          رقم الفاتورة: {invoice.id}
        </div>
      </div>
      <div
        style={{
          borderBottom: "2px solid #2c3e50",
          paddingBottom: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ fontSize: "16px" }}>
          <strong>التاريخ:</strong>{" "}
          {new Date(invoice.createdAt).toLocaleDateString("ar-AE", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>
            مستلم من السيد:
          </h3>
          <p style={{ margin: "0" }}>
            {invoice.invoiceType === "MAINTENANCE"
              ? invoice.owner?.name
              : invoice.renter?.name || "N/A"}
          </p>
        </div>
        <div>
          <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>
            المبلغ وقدره:
          </h3>
          <p style={{ margin: "0" }}>
            {invoice.amount ? formatCurrencyAED(invoice.amount) : "N/A"}
          </p>
        </div>
        <div>
          <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>نوع الدفع:</h3>
          <p style={{ margin: "0" }}>
            {invoice.paymentTypeMethod
              ? invoice.paymentTypeMethod === "CASH"
                ? "نقداً"
                : invoice.paymentTypeMethod === "BANK"
                  ? "تحويل بنكي"
                  : invoice.paymentTypeMethod === "CHEQUE"
                    ? "شيك"
                    : "N/A"
              : "N/A"}
          </p>
        </div>
        <div>
          <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>
            تاريخ الدفع:
          </h3>
          <p style={{ margin: "0" }}>
            {new Date(invoice.payment.dueDate).toLocaleDateString("ar-AE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>وذالك عن:</h3>
          <p style={{ margin: "0" }}>
            {"دفعة " +
              PaymentType[invoice.invoiceType] +
              " " +
              invoice.description +
              " "}
            لي{" "}
            {invoice.invoiceType === "MAINTENANCE"
              ? "عقار " + invoice.property.name
              : "الوحدة رقم " +
                invoice.rentAgreement?.unit?.number +
                " التابعة لعقار " +
                invoice.property.name +
                " عن عقد إيجار رقم " +
                invoice.rentAgreement?.rentAgreementNumber}
          </p>
        </div>
        <div style={{ gridColumn: "span 2" }}>
          <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>اسم المحصل:</h3>
          <p style={{ margin: "0" }}>
            {invoice.property.collector?.name || "N/A"}
          </p>
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ marginBottom: "5px", color: "#2c3e50" }}>المستلم:</h3>
        <p style={{ margin: "0" }}>_______________________</p>
      </div>
    </div>
  );
});

InvoicePrint.displayName = "InvoicePrint";

export default InvoicePrint;
