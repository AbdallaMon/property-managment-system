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
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useReactToPrint} from "react-to-print";
import dayjs from "dayjs";
import "dayjs/locale/en-gb";
import InvoicePrint from "./InvoicePrint";
import {formatCurrencyAED} from "@/helpers/functions/convertMoneyToArabic";

const invoiceTypeMapping = {
    ALL: "كل الفواتير",
    RENT: "إيجار",
    TAX: "ضريبة",
    INSURANCE: "تأمين",
    REGISTRATION: "تسجيل",
    MAINTENANCE: "صيانة",
};

const InvoicePage = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState("");
    const [units, setUnits] = useState([]);
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs().endOf("month"));
    const [invoices, setInvoices] = useState([]);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const [invoiceType, setInvoiceType] = useState("ALL");
    const componentRef = useRef();
    const printRef = useRef();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    useEffect(() => {
        async function fetchProperties() {
            setLoading(true);
            try {
                const resProperties = await fetch("/api/fast-handler?id=properties");
                const dataProperties = await resProperties.json();
                setProperties(Array.isArray(dataProperties) ? dataProperties : []);
            } catch (error) {
                console.error("Failed to fetch properties", error);
            }
            setLoading(false);
        }

        fetchProperties();
    }, []);

    const fetchUnits = async (propertyId) => {
        try {
            const resUnits = await fetch(
                  `/api/fast-handler?id=unit&propertyId=${propertyId}`,
            );
            const dataUnits = await resUnits.json();
            setUnits(Array.isArray(dataUnits) ? dataUnits : []);
        } catch (error) {
            console.error("Failed to fetch units", error);
        }
    };

    const handlePropertyChange = (event) => {
        const propertyId = event.target.value;
        setSelectedProperty(propertyId);
        setSelectedUnits([]);
        fetchUnits(propertyId);
    };

    const handleSelectAllUnits = () => {
        if (units.length > 0) {
            setSelectedUnits(units.map((unit) => unit.id));
        }
    };

    const handleGenerateInvoices = async () => {
        setSubmitLoading(true);
        const filters = {
            unitIds: selectedUnits.length
                  ? selectedUnits
                  : units.map((unit) => unit.id),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            propertyId: selectedProperty,
            invoiceType: invoiceType,
        };

        try {
            const res = await fetch(
                  `/api/main/invoices?filters=${JSON.stringify(filters)}`,
            );
            const data = await res.json();
            setInvoices(data.data);
        } catch (error) {
            console.error("Failed to generate invoices", error);
        }
        setSubmitLoading(false);
    };

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: "فاتورة",
        onBeforeGetContent: () => setPrintLoading(true),
        onAfterPrint: () => setPrintLoading(false),
    });

    const renderInvoices = (invoices) => (
          <TableContainer component={Paper} sx={{mb: 4}}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell>رقم الفاتورة</TableCell>
                          <TableCell>العقار</TableCell>
                          <TableCell>رقم الوحدة</TableCell>
                          <TableCell>نوع الفاتورة</TableCell>
                          <TableCell>تاريخ الفاتورة</TableCell>
                          <TableCell>المبلغ</TableCell>
                          <TableCell>طباعة</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {invoices?.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell>{invoice.id}</TableCell>
                                <TableCell>{invoice.property?.name || "N/A"}</TableCell>
                                <TableCell>
                                    {invoice.rentAgreement?.unit?.number || "N/A"}
                                </TableCell>
                                <TableCell>
                                    {invoiceTypeMapping[invoice.invoiceType] || invoice.invoiceType}
                                </TableCell>
                                <TableCell>
                                    {new Date(invoice.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{formatCurrencyAED(invoice.amount)}</TableCell>
                                <TableCell>
                                    <Button
                                          variant="contained"
                                          color="secondary"
                                          onClick={() => {
                                              setCurrentInvoice(invoice);
                                              setTimeout(handlePrint, 500); // Ensure correct invoice is printed
                                          }}
                                    >
                                        طباعة
                                    </Button>
                                </TableCell>
                            </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
    );

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
                      جلب الفواتير
                  </Typography>
                  <FormControl fullWidth margin="normal">
                      <InputLabel>العقارات</InputLabel>
                      <Select value={selectedProperty} onChange={handlePropertyChange}>
                          {properties.map((property) => (
                                <MenuItem key={property.id} value={property.id}>
                                    {property.name}
                                </MenuItem>
                          ))}
                      </Select>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                      <InputLabel>الوحدات</InputLabel>
                      <Select
                            multiple
                            value={selectedUnits}
                            onChange={(e) => setSelectedUnits(e.target.value)}
                      >
                          {units.map((unit) => (
                                <MenuItem key={unit.id} value={unit.id}>
                                    {unit.number}
                                </MenuItem>
                          ))}
                          <MenuItem value="ALL" onClick={handleSelectAllUnits}>
                              تحديد كل الوحدات
                          </MenuItem>
                      </Select>
                  </FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box sx={{display: "flex", justifyContent: "flex-start", gap: 2}}>
                          <DatePicker
                                label="تاريخ البدء"
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                renderInput={(params) => <TextField {...params} />}
                                format="DD/MM/YYYY"
                          />
                          <DatePicker
                                label="تاريخ الانتهاء"
                                value={endDate}
                                onChange={(date) => setEndDate(date)}
                                renderInput={(params) => <TextField {...params} />}
                                format="DD/MM/YYYY"
                          />
                      </Box>
                  </LocalizationProvider>

                  <FormControl fullWidth margin="normal">
                      <InputLabel>نوع الفاتورة</InputLabel>
                      <Select
                            value={invoiceType}
                            onChange={(e) => setInvoiceType(e.target.value)}
                      >
                          {Object.entries(invoiceTypeMapping).map(([key, value]) => (
                                <MenuItem key={key} value={key}>
                                    {value}
                                </MenuItem>
                          ))}
                      </Select>
                  </FormControl>

                  <Button
                        variant="contained"
                        color="primary"
                        onClick={handleGenerateInvoices}
                        disabled={submitLoading}
                  >
                      {submitLoading ? <CircularProgress size={24}/> : "جلب الفواتير"}
                  </Button>

                  {invoices?.length > 0 && (
                        <Box
                              sx={{mt: 4, p: 2, border: "1px solid #ddd"}}
                              ref={componentRef}
                        >
                            {renderInvoices(invoices)}
                        </Box>
                  )}

                  {printLoading && <CircularProgress/>}

                  {currentInvoice && (
                        <div style={{display: "none"}}>
                            <InvoicePrint ref={printRef} invoice={currentInvoice}/>
                        </div>
                  )}

                  <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={() => setSnackbarOpen(false)}
                  >
                      <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                          تم تحديث الفاتورة بنجاح!
                      </Alert>
                  </Snackbar>
              </Box>
          </Container>
    );
};

export default InvoicePage;
