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

const columnsRentAgreements = [
  { arabic: "رقم الوحدة", english: "unitNumber" },
  { arabic: "رقم عقد الإيجار", english: "rentAgreementNumber" },
  { arabic: "تاريخ البدء", english: "startDate" },
  { arabic: "تاريخ الانتهاء", english: "endDate" },
  {arabic: "حالة عقد الايجار",english: "customStatus"},
  { arabic: "إجمالي سعر العقد", english: "totalAmount" },
  { arabic: "ما تم دفعه", english: "paidAmount" },
  { arabic: "المتبقي", english: "remainingAmount" },
  { arabic: "عمولة الإدارة", english: "managementCommission" },

];

const RentAgreementsReport = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [status, setStatus] = useState("ALL");
  const [reportData, setReportData] = useState(null);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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

  const handleGenerateReport = async () => {
    setSubmitLoading(true);
    const filters = {
      propertyIds: selectedProperties,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status,
    };

    try {
      const res = await fetch(
            `/api/main/reports/rents?filters=${JSON.stringify(filters)}`,
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
    documentTitle: "تقرير عقود الإيجار",
  });

  const renderTableRows = (data, columns, colSpan) => {
    let totalContractAmount = 0;
    let totalPaidAmount = 0;
    let totalRemainingAmount = 0;
    let totalManagementCommission = 0;

    return (
          <>
            {data.map((row, index) => {
              const totalAmount = row.totalAmount;
              const paidAmount = row.paidAmount;
              const remainingAmount = row.remainingAmount;
              const managementCommission = row.managementCommission;

              totalContractAmount += totalAmount;
              totalPaidAmount += paidAmount;
              totalRemainingAmount += remainingAmount;
              totalManagementCommission += managementCommission;

              return (
                    <TableRow key={index}>
                      {columns.map((col, colIndex) => {
                        let cellValue = col.english
                              .split(".")
                              .reduce((acc, part) => acc && acc[part], row);

                        if (
                              col.english.includes("date") ||
                              col.english.includes("Date")
                        ) {
                          cellValue = new Date(cellValue).toLocaleDateString();
                        } else if (
                              col.english.includes("price") ||
                              col.english.includes("amount") ||
                              col.english.includes("totalPrice") ||
                              col.english.includes("paidAmount") ||
                              col.english.includes("yearlyRentPrice") ||
                              col.english.includes("managementCommission")
                        ) {
                          cellValue = formatCurrencyAED(cellValue);
                        }

                        if (col.english === "totalAmount") {
                          cellValue = formatCurrencyAED(totalAmount);
                        }

                        if (col.english === "paidAmount") {
                          cellValue = formatCurrencyAED(paidAmount);
                        }

                        if (col.english === "remainingAmount") {
                          cellValue = formatCurrencyAED(remainingAmount);
                        }

                        if (col.english === "managementCommission") {
                          cellValue = formatCurrencyAED(managementCommission);
                        }

                        return (
                              <TableCell
                                    key={colIndex}
                                    sx={{ backgroundColor: "#ffffff", padding: "8px" }}
                              >
                                {cellValue}
                              </TableCell>
                        );
                      })}
                    </TableRow>
              );
            })}

            {columns.some(
                  (col) =>
                        col.english.includes("amount") ||
                        col.english.includes("managementCommission"),
            ) && (
                  <TableRow>
                    <TableCell
                          colSpan={colSpan ? colSpan : columns.length - 4}
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
                      {formatCurrencyAED(totalContractAmount)}
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
                      {formatCurrencyAED(totalRemainingAmount)}
                    </TableCell>
                    <TableCell
                          sx={{
                            backgroundColor: "#ffffff",
                            padding: "8px",
                            fontWeight: "bold",
                          }}
                    >
                      {formatCurrencyAED(totalManagementCommission)}
                    </TableCell>
                  </TableRow>
            )}
          </>
    );
  };

  if (loading) return <CircularProgress />;
  return (
        <Container
              sx={{
                p: {
                  xs: 0,
                  md: 1,
                },
              }}
        >
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              إنشاء تقرير عقود الإيجار
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel>العقارات</InputLabel>
              <Select
                    multiple
                    value={selectedProperties}
                    onChange={(e) => setSelectedProperties(e.target.value)}
              >
                {properties.map((property) => (
                      <MenuItem key={property.id} value={property.id}>
                        {property.name}
                      </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/*<FormControl fullWidth margin="normal">*/}
            {/*  <InputLabel>الحالة</InputLabel>*/}
            {/*  <Select*/}
            {/*        value={status}*/}
            {/*        onChange={(e) => setStatus(e.target.value)}*/}
            {/*  >*/}
            {/*    <MenuItem value="ALL">الجميع</MenuItem>*/}
            {/*    <MenuItem value="ACTIVE">نشط</MenuItem>*/}
            {/*    <MenuItem value="EXPIRED">منتهي</MenuItem>*/}
            {/*    <MenuItem value="CANCELED"> ملغي</MenuItem>*/}
            {/*  </Select>*/}
            {/*</FormControl>*/}

            {/*<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">*/}
            {/*  <FormControl fullWidth margin="normal">*/}
            {/*    <DatePicker*/}
            {/*          label="تاريخ البدء"*/}
            {/*          value={startDate}*/}
            {/*          onChange={(date) => setStartDate(date)}*/}
            {/*          renderInput={(params) => <TextField {...params} />}*/}
            {/*    />*/}
            {/*  </FormControl>*/}
            {/*  <FormControl fullWidth margin="normal">*/}
            {/*    <DatePicker*/}
            {/*          label="تاريخ الانتهاء"*/}
            {/*          value={endDate}*/}
            {/*          onChange={(date) => setEndDate(date)}*/}
            {/*          renderInput={(params) => <TextField {...params} />}*/}
            {/*    />*/}
            {/*  </FormControl>*/}
            {/*</LocalizationProvider>*/}

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
                    {reportData.map((property) => (
                          <div key={property.id}>
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
                                  <strong>اسم المالك:</strong> {property.client.name}
                                </div>
                                <div>
                                  <strong> هوية المالك:</strong>{" "}
                                  {property.client.nationalId}
                                </div>
                                <div>
                                  <strong> ايميل المالك:</strong> {property.client.email}
                                </div>
                                <div>
                                  <strong> رقمة هاتف المالك:</strong>{" "}
                                  {property.client.phone}
                                </div>
                              </Typography>
                            </Box>

                            <Typography variant="h6" gutterBottom>
                              {property.name}
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom>
                              عقود الإيجار
                            </Typography>
                            <ReportTable headings={columnsRentAgreements} title=" ">
                              {renderTableRows(
                                    property.rentAgreements,
                                    columnsRentAgreements,
                                    5,
                              )}
                            </ReportTable>
                          </div>
                    ))}
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

export default RentAgreementsReport;

