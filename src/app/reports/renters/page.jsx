"use client";
import React, { useEffect, useRef, useState } from "react";
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
  Typography,
} from "@mui/material";
import { useReactToPrint } from "react-to-print";
import ReportTable from "@/app/components/Tables/ReportTable";

const columnsPropertyDetails = [
  { arabic: "معرف العقار", english: "propertyId" },
  { arabic: "الاسم", english: "name" },
  { arabic: "المالك", english: "client.name" },
  { arabic: "هوية المالك", english: "client.nationalId" },
  { arabic: "رقم هاتف المالك", english: "client.phone" },
  { arabic: "ايميل المالك", english: "client.email" },
];

const columnsUnits = [
  { arabic: "رقم الوحدة", english: "number" },
  { arabic: "معرف الوحدة", english: "unitId" },
  { arabic: "نوع الوحدة", english: "type.name" },
  { arabic: "اسم المستأجر", english: "activeAgreement.renter.name" },
  { arabic: "هوية المستأجر", english: "activeAgreement.renter.nationalId" },
  { arabic: "رقم هاتف المستأجر", english: "activeAgreement.renter.phone" },
  { arabic: "ايميل المستأجر", english: "activeAgreement.renter.email" },
];

const RentedUnitsReport = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [reportData, setReportData] = useState(null);
  const componentRef = useRef();
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
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

  const handleGenerateReport = async () => {
    setSubmitLoading(true);
    try {
      const filters = {
        propertyIds: selectedProperties,
      };
      const res = await fetch(
        `/api/main/reports/renters?filters=${JSON.stringify(filters)}`,
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
    documentTitle: "تقرير الوحدات المؤجرة",
  });

  const renderTableRows = (data, columns, colSpan) => (
    <>
      {data.map((row, index) => (
        <TableRow key={index}>
          {columns.map((col, colIndex) => {
            let cellValue = col.english
              .split(".")
              .reduce((acc, part) => acc && acc[part], row);

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
      ))}
    </>
  );

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
          إنشاء تقرير الوحدات المؤجرة
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
              <Box key={property.id} sx={{ mb: 4 }}>
                <Box
                  sx={{
                    mb: 4,
                    p: 2,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    تفاصيل العقار
                  </Typography>
                  <ReportTable headings={columnsPropertyDetails} title=" ">
                    {renderTableRows([property], columnsPropertyDetails)}
                  </ReportTable>
                  <Typography variant="body1" gutterBottom>
                    <strong>عدادات الكهرباء:</strong>
                  </Typography>
                  <ul>
                    {property.electricityMeters.map((meter) => (
                      <li key={meter.id}>
                        {meter.name} - {meter.meterId}
                      </li>
                    ))}
                  </ul>
                </Box>

                <Typography variant="h6" gutterBottom>
                  الوحدات المؤجرة
                </Typography>
                <ReportTable headings={columnsUnits} title=" ">
                  {renderTableRows(
                    property.units.filter(
                      (unit) => unit.rentAgreements.length > 0,
                    ),
                    columnsUnits,
                  )}
                </ReportTable>
              </Box>
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

export default RentedUnitsReport;
