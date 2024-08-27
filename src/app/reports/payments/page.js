"use client";
import React, {useEffect, useRef, useState} from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TableCell,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {useReactToPrint} from "react-to-print";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import ReportTable from "@/app/components/Tables/ReportTable";
import {formatCurrencyAED} from "@/helpers/functions/convertMoneyToArabic";

const paymentTypes = [
    {value: "TAX", label: "الضريبة"},
    {value: "INSURANCE", label: "التأمين"},
    {value: "REGISTRATION", label: "التسجيل"},
    {value: "RENT", label: "تحصيل ايجار"}
];

const paymentStatusOptions = [
    {value: "PAID", label: "تم دفعها"},
    {value: "UNPAID", label: "لم يتم دفعها بعد"},
    {value: "ALL", label: "الجميع"},
];

const columnsPayments = [
    {arabic: "اسم العقار", english: "unit.property.name"},
    {arabic: "الوحدة", english: "unit.number"},
    {arabic: "نوع الدفع", english: "paymentType"},
    {arabic: "تم الدفع بالكامل", english: "isFullPaid"},
    {arabic: "التكلفة", english: "amount"},
    {arabic: "المبلغ المدفوع", english: "paidAmount"},
    {arabic: "رقم عقد الإيجار", english: "rentAgreement.rentAgreementNumber"},
    {arabic: "حالة العقد", english: "rentAgreementStatus"},
    {arabic: "وقت الاستحقاق", english: "date"}
];

const translatePaymentType = (type) => {
    switch (type) {
        case "TAX":
            return "الضريبة";
        case "INSURANCE":
            return "التأمين";
        case "REGISTRATION":
            return "التسجيل";
        case "RENT":
            return "تحصيل ايجار";
        default:
            return type;
    }
};

const PaymentsReport = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [units, setUnits] = useState([]);
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [selectedPaymentTypes, setSelectedPaymentTypes] = useState([]);
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("ALL");
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));
    const [reportData, setReportData] = useState(null);
    const componentRef = useRef();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [status, setStatus] = useState("ALL");
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const resProperties = await fetch("/api/fast-handler?id=properties");
                const dataProperties = await resProperties.json();
                setProperties(dataProperties);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
            setLoading(false);
        }

        fetchData();
    }, []);

    const handlePropertyChange = async (e) => {
        const propertyId = e.target.value;
        setSelectedProperty(propertyId);
        setSelectedUnits([]);
        setUnits([]);

        try {
            const resUnits = await fetch(
                  `/api/fast-handler?id=unit&propertyId=${propertyId}`,
            );
            const dataUnits = await resUnits.json();
            const dataWithLabel = dataUnits.map((item) => ({
                ...item,
                label: item.number,
            }));
            setUnits(dataWithLabel);
        } catch (error) {
            console.error("Failed to fetch units", error);
        }
    };

    const handleGenerateReport = async () => {
        setSubmitLoading(true);
        const filters = {
            propertyId: selectedProperty,
            unitIds: selectedUnits.includes("ALL")
                  ? units.map((unit) => unit.id)
                  : selectedUnits,
            paymentTypes: selectedPaymentTypes,
            paymentStatus: selectedPaymentStatus,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            status,
        };

        try {
            const res = await fetch(
                  `/api/main/reports/payments?filters=${JSON.stringify(filters)}`,
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
        documentTitle: "تقرير المدفوعات",
    });

    const renderTableRows = (data, columns, colSpan) => {
        let totalAmount = 0;
        let totalPaidAmount = 0;

        return (
              <>
                  {data.map((row, index) => {
                      const hasInvoices = row.invoices && row.invoices.length > 0;
                      return (
                            <React.Fragment key={index}>
                                <TableRow>
                                    {columns.map((col, colIndex) => {
                                        let cellValue = col.english
                                              .split(".")
                                              .reduce((acc, part) => acc && acc[part], row);

                                        if (col.english.includes("date") || col.english.includes("Date")) {
                                            cellValue = dayjs(cellValue).format("DD/MM/YYYY");
                                        } else if (col.english.includes("price") || col.english.includes("amount") || col.english.includes("totalPrice") || col.english.includes("paidAmount") || col.english.includes("yearlyRentPrice")) {
                                            cellValue = formatCurrencyAED(cellValue);
                                        }

                                        if (col.english === "paymentType") {
                                            cellValue = translatePaymentType(cellValue);
                                        }

                                        if (col.english.includes("amount")) {
                                            totalAmount += row.amount;
                                        }

                                        if (col.english.includes("paidAmount")) {
                                            totalPaidAmount += row.paidAmount;
                                        }

                                        return (
                                              <TableCell
                                                    key={colIndex}
                                                    sx={{backgroundColor: "#ffffff", padding: "10px 8px"}}
                                              >
                                                  {cellValue}
                                              </TableCell>
                                        );
                                    })}
                                </TableRow>
                                {hasInvoices && row.invoices.map((invoice, invoiceIndex) => (
                                      <TableRow key={`invoice-${invoiceIndex}`} sx={{backgroundColor: "#e3e3e3"}}>
                                          <TableCell colSpan={5}>
                                              <Typography variant="body2">
                                                  {`قيمة الفاتورة: ${formatCurrencyAED(invoice.amount)}`}
                                              </Typography>
                                          </TableCell>
                                          <TableCell colSpan={4}>
                                              <Typography variant="body2">
                                                  {`تم الدفع في: ${dayjs(invoice.createdAt).format("DD/MM/YYYY")}`}
                                              </Typography>
                                          </TableCell>
                                      </TableRow>
                                ))}
                            </React.Fragment>
                      );
                  })}
                  {columns.some((col) => col.english.includes("amount")) && (
                        <TableRow>
                            <TableCell
                                  colSpan={colSpan ? colSpan : columns.length - 2}
                                  sx={{
                                      backgroundColor: "#f0f0f0",
                                      padding: "8px",
                                      fontWeight: "bold",
                                  }}
                            >
                                الاجمالي
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
                            {totalPaidAmount > 0 && (
                                  <TableCell
                                        sx={{
                                            backgroundColor: "#ffffff",
                                            padding: "8px",
                                            fontWeight: "bold",
                                        }}
                                  >
                                      {formatCurrencyAED(totalPaidAmount)}
                                  </TableCell>
                            )}
                        </TableRow>
                  )}
              </>
        );
    };

    if (loading) return <CircularProgress/>;
    return (
          <Container
                sx={{
                    p: {
                        xs: 0,
                        md: 1,
                    },
                }}
          >
              <Box sx={{my: 4}}>
                  <Typography variant="h4" gutterBottom>
                      إنشاء تقرير المدفوعات
                  </Typography>
                  <FormControl fullWidth margin="normal">
                      <InputLabel>العقار</InputLabel>
                      <Select value={selectedProperty} onChange={handlePropertyChange}>
                          {properties.map((property) => (
                                <MenuItem key={property.id} value={property.id}>
                                    {property.name}
                                </MenuItem>
                          ))}
                      </Select>
                  </FormControl>

                  {selectedProperty && (
                        <>
                            <FormControl fullWidth margin="normal">
                                <InputLabel>الوحدات</InputLabel>
                                <Select
                                      multiple
                                      value={selectedUnits}
                                      onChange={(e) => setSelectedUnits(e.target.value)}
                                >
                                    <MenuItem value="ALL">جميع الوحدات</MenuItem>
                                    {units.map((unit) => (
                                          <MenuItem key={unit.id} value={unit.id}>
                                              {unit.label}
                                          </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>نوع الدفع</InputLabel>
                                <Select
                                      multiple
                                      value={selectedPaymentTypes}
                                      onChange={(e) => setSelectedPaymentTypes(e.target.value)}
                                >
                                    {paymentTypes.map((type) => (
                                          <MenuItem key={type.value} value={type.value}>
                                              {type.label}
                                          </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth margin="normal">
                                <InputLabel>حالة الدفع</InputLabel>
                                <Select
                                      value={selectedPaymentStatus}
                                      onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                                >
                                    {paymentStatusOptions.map((status) => (
                                          <MenuItem key={status.value} value={status.value}>
                                              {status.label}
                                          </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                  adapterLocale="en-gb"
                            >
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
                        </>
                  )}

                  <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateReport}
                        disabled={submitLoading}
                  >
                      {submitLoading ? <CircularProgress size={24}/> : "إنشاء التقرير"}
                  </Button>

                  {reportData && (
                        <Box
                              sx={{mt: 4, p: 2, border: "1px solid #ddd"}}
                              ref={componentRef}
                        >
                            {paymentTypes
                                  .filter((type) => selectedPaymentTypes.includes(type.value))
                                  .map((type) => {
                                      const typePayments = reportData.filter(
                                            (payment) => payment.paymentType === type.value,
                                      );
                                      return (
                                            <div key={type.value}>

                                                <ReportTable headings={columnsPayments} title={type.label}>
                                                    {renderTableRows(typePayments, columnsPayments, 4)}
                                                </ReportTable>
                                            </div>
                                      );
                                  })}
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

export default PaymentsReport;
