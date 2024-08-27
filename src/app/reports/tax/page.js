"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  TableRow,
  TableCell,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import ReportTable from "@/app/components/Tables/ReportTable";
import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic";

const columnsTaxPayments = [
  { arabic: "اسم العقار", english: "propertyName" },
  { arabic: "رقم الوحدة", english: "unitNumber" },
  { arabic: "ميعاد الدفع", english: "dueDate" },
  { arabic: " نسبة الضريبة", english: "rentAgreement.tax" },
  { arabic: " قيمة عقد الايجار", english: "rentAgreement.totalPrice" },
  { arabic: "المبلغ الإجمالي", english: "amount" },
  { arabic: "المبلغ المدفوع", english: "paidAmount" },
  { arabic: "المبلغ المتبقي", english: "remainingAmount" },
];

const TaxPaymentsReport = () => {
  const [owners, setOwners] = useState([]);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [reportData, setReportData] = useState(null);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const resOwners = await fetch("/api/fast-handler?id=owner");
        const dataOwners = await resOwners.json();
        setOwners(dataOwners);
      } catch (error) {
        console.error("Failed to fetch owners", error);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    setSubmitLoading(true);
    const filters = {
      ownerId: selectedOwner,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    try {
      const res = await fetch(
        `/api/main/reports/tax?filters=${JSON.stringify(filters)}`,
      );
      const data = await res.json();
      setReportData(data.data);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to generate report", error);
    }
    setSubmitLoading(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "تقرير الضريبة",
  });

  const renderTableRows = (data) => {
    let totalAmount = 0;
    let totalPaidAmount = 0;
    let totalRemaining = 0;
let totalAmountOfRent = 0;
    return (
      <>
        {data.map((payment, index) => {
          totalAmount += payment.amount;
          totalPaidAmount += payment.paidAmount;
          totalRemaining += payment.amount - payment.paidAmount;
          totalAmountOfRent += payment.rentAgreement.totalPrice;
          return (
            <TableRow key={index}>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {payment.propertyName}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {payment.unitNumber}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {dayjs(payment.dueDate).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {payment.rentAgreement.tax+"%"}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {formatCurrencyAED(payment.rentAgreement.totalPrice)}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {formatCurrencyAED(payment.amount)}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {formatCurrencyAED(payment.paidAmount)}
              </TableCell>
              <TableCell sx={{ backgroundColor: "#ffffff", padding: "8px" }}>
                {formatCurrencyAED(payment.amount - payment.paidAmount)}
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell
            colSpan={4}
            sx={{
              backgroundColor: "#f0f0f0",
              padding: "8px",
              fontWeight: "bold",
            }}
          >
            الإجمالي
          </TableCell>
          <TableCell
                sx={{
                  backgroundColor: "#ffffff",
                  padding: "8px",
                  fontWeight: "bold",
                }}
          >
            {formatCurrencyAED(totalAmountOfRent)}
          </TableCell>
          <TableCell
            sx={{
              backgroundColor: "#ffffff",
              padding: "8px",
              fontWeight: "bold",
            }}
          >
            {formatCurrencyAED(totalAmount)}
          </TableCell>
          <TableCell
            sx={{
              backgroundColor: "#ffffff",
              padding: "8px",
              fontWeight: "bold",
            }}
          >
            {formatCurrencyAED(totalPaidAmount)}
          </TableCell>
          <TableCell
            sx={{
              backgroundColor: "#ffffff",
              padding: "8px",
              fontWeight: "bold",
            }}
          >
            {formatCurrencyAED(totalRemaining)}
          </TableCell>
        </TableRow>
      </>
    );
  };

  if (loading) return <CircularProgress />;
  return (
    <Container sx={{ p: { xs: 0, md: 1 } }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          إنشاء تقرير الضريبة
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>المالك</InputLabel>
          <Select
            value={selectedOwner}
            onChange={(e) => setSelectedOwner(e.target.value)}
          >
            {owners?.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="تاريخ البدء"
              value={startDate}
              onChange={(date) => setStartDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="تاريخ الانتهاء"
              value={endDate}
              onChange={(date) => setEndDate(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </FormControl>
        </LocalizationProvider>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateReport}
          disabled={submitLoading}
        >
          {submitLoading ? <CircularProgress size={24} /> : "إنشاء التقرير"}
        </Button>

        {reportData && (
          <Box
            sx={{ mt: 4, p: 2, border: "1px solid #ddd" }}
            ref={componentRef}
          >
            <Typography variant="h6" gutterBottom>
              تقرير الضريبة من المدة {startDate.format("DD/MM/YYYY")} إلى{" "}
              {endDate.format("DD/MM/YYYY")}
            </Typography>
            <Box
              sx={{
                mb: 4,
                p: 2,
                backgroundColor: "#f5f5f5",
                borderRadius: "8px",
              }}
            >
              <Typography variant="h6" gutterBottom>
                تفاصيل المالك
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "10px",
                }}
              >
                <div>
                  <strong>اسم المالك:</strong>{" "}
                  {owners?.find((owner) => owner.id === selectedOwner)?.name}
                </div>
                <div>
                  <strong> هوية المالك:</strong>{" "}
                  {
                    owners?.find((owner) => owner.id === selectedOwner)
                      ?.nationalId
                  }
                </div>
                <div>
                  <strong> ايميل المالك:</strong>{" "}
                  {owners?.find((owner) => owner.id === selectedOwner)?.email}
                </div>
                <div>
                  <strong> رقمة هاتف المالك:</strong>{" "}
                  {owners?.find((owner) => owner.id === selectedOwner)?.phone}
                </div>
              </Typography>
            </Box>

            <ReportTable
              headings={columnsTaxPayments.map((col) => col)}
              title="تفاصيل الضريبة"
            >
              {renderTableRows(reportData)}
            </ReportTable>
          </Box>
        )}

        <Button variant="contained" color="secondary" onClick={handlePrint}>
          طباعة التقرير
        </Button>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success">
            تم إنشاء التقرير بنجاح!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default TaxPaymentsReport;
