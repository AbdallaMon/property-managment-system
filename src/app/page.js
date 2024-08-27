"use client";
import {useEffect, useState} from "react";
import {Box, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {ArcElement, Chart as ChartJS, Legend, Title, Tooltip} from "chart.js";
import CardComponent from './CardComponent'; // import your CardComponent
import {formatCurrencyAED} from "@/helpers/functions/convertMoneyToArabic"; // Adjust the import path as needed

ChartJS.register(
      ArcElement,
      Title,
      Tooltip,
      Legend,
      ChartDataLabels,
);

const Dashboard = () => {
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState("all");

    const [units, setUnits] = useState({total: 0, rented: 0, nonRented: 0});
    const [agreements, setAgreements] = useState({total: 0, active: 0, expired: 0});
    const [rentPayments, setRentPayments] = useState({totalAmount: 0, totalPaidAmount: 0, totalRemainingAmount: 0});
    const [currentMonthPayments, setCurrentMonthPayments] = useState({
        totalAmount: 0,
        totalPaidAmount: 0,
        totalRemainingAmount: 0,
    });
    const [maintenancePayments, setMaintenancePayments] = useState({
        totalAmount: 0,
        totalPaidAmount: 0,
        totalRemainingAmount: 0
    });
    const [currentMonthMaintenancePayments, setCurrentMonthMaintenancePayments] = useState({
        totalAmount: 0,
        totalPaidAmount: 0,
        totalRemainingAmount: 0,
    });
    const [otherPayments, setOtherPayments] = useState({
        totalAmount: 0,
        totalPaidAmount: 0,
        totalRemainingAmount: 0
    });
    const [currentMonthOtherPayments, setCurrentMonthOtherPayments] = useState({
        totalAmount: 0,
        totalPaidAmount: 0,
        totalRemainingAmount: 0,
    });

    const [loadingUnits, setLoadingUnits] = useState(true);
    const [loadingAgreements, setLoadingAgreements] = useState(true);
    const [loadingRentPayments, setLoadingRentPayments] = useState(true);
    const [loadingCurrentMonthPayments, setLoadingCurrentMonthPayments] = useState(true);
    const [loadingMaintenancePayments, setLoadingMaintenancePayments] = useState(true);
    const [loadingCurrentMonthMaintenancePayments, setLoadingCurrentMonthMaintenancePayments] = useState(true);
    const [loadingOtherPayments, setLoadingOtherPayments] = useState(true);
    const [loadingCurrentMonthOtherPayments, setLoadingCurrentMonthOtherPayments] = useState(true);

    useEffect(() => {
        async function fetchProperties() {
            try {
                const res = await fetch("/api/fast-handler?id=properties");
                const data = await res.json();
                setProperties(data || []);
            } catch (error) {
                console.error("Failed to fetch properties", error);
            }
        }

        fetchProperties();
    }, []);

    useEffect(() => {
        async function fetchUnits() {
            setLoadingUnits(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/units?${propertyParam}`);
                const data = await res.json();
                setUnits(data);
            } catch (error) {
                console.error("Failed to fetch units", error);
            }
            setLoadingUnits(false);
        }

        fetchUnits();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchAgreements() {
            setLoadingAgreements(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/rentAgreements?${propertyParam}`);
                const data = await res.json();
                setAgreements(data);
            } catch (error) {
                console.error("Failed to fetch agreements", error);
            }
            setLoadingAgreements(false);
        }

        fetchAgreements();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchRentPayments() {
            setLoadingRentPayments(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/rentPayments?${propertyParam}`);
                const data = await res.json();
                setRentPayments(data);
            } catch (error) {
                console.error("Failed to fetch rent payments", error);
            }
            setLoadingRentPayments(false);
        }

        fetchRentPayments();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchCurrentMonthPayments() {
            setLoadingCurrentMonthPayments(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/payments?${propertyParam}`);
                const data = await res.json();
                setCurrentMonthPayments(data);
            } catch (error) {
                console.error("Failed to fetch current month payments", error);
            }
            setLoadingCurrentMonthPayments(false);
        }

        fetchCurrentMonthPayments();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchMaintenancePayments() {
            setLoadingMaintenancePayments(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/totalExpences?${propertyParam}`);
                const data = await res.json();
                setMaintenancePayments(data);
            } catch (error) {
                console.error("Failed to fetch maintenance payments", error);
            }
            setLoadingMaintenancePayments(false);
        }

        fetchMaintenancePayments();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchCurrentMonthMaintenancePayments() {
            setLoadingCurrentMonthMaintenancePayments(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/currentMonthMaintenancePayments?${propertyParam}`);
                const data = await res.json();
                setCurrentMonthMaintenancePayments(data);
            } catch (error) {
                console.error("Failed to fetch current month maintenance payments", error);
            }
            setLoadingCurrentMonthMaintenancePayments(false);
        }

        fetchCurrentMonthMaintenancePayments();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchOtherPayments() {
            setLoadingOtherPayments(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/otherPayments?${propertyParam}`);
                const data = await res.json();
                setOtherPayments(data);
            } catch (error) {
                console.error("Failed to fetch other payments", error);
            }
            setLoadingOtherPayments(false);
        }

        fetchOtherPayments();
    }, [selectedProperty]);

    useEffect(() => {
        async function fetchCurrentMonthOtherPayments() {
            setLoadingCurrentMonthOtherPayments(true);
            try {
                const propertyParam = selectedProperty !== "all" ? `propertyId=${selectedProperty}` : "";
                const res = await fetch(`/api/main/home/currentMonthOtherPayments?${propertyParam}`);
                const data = await res.json();
                setCurrentMonthOtherPayments(data);
            } catch (error) {
                console.error("Failed to fetch current month other payments", error);
            }
            setLoadingCurrentMonthOtherPayments(false);
        }

        fetchCurrentMonthOtherPayments();
    }, [selectedProperty]);

    const handlePropertyChange = (event) => {
        setSelectedProperty(event.target.value);
    };

    const unitsChartData = {
        labels: ['الوحدات المؤجرة', 'الوحدات الشاغرة'],
        datasets: [
            {
                data: [units.rented, units.nonRented],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const agreementsChartData = {
        labels: ['النشط', 'منتهي'],
        datasets: [
            {
                data: [agreements.active, agreements.expired],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const rentPaymentsChartData = {
        labels: ['الإيجار المحصل', 'الإيجار المتبقي'],
        datasets: [
            {
                data: [rentPayments.totalPaidAmount, rentPayments.totalRemainingAmount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const currentMonthPaymentsChartData = {
        labels: ['المبلغ المحصل', 'المبلغ المتبقي'],
        datasets: [
            {
                data: [currentMonthPayments.totalPaidAmount, currentMonthPayments.totalRemainingAmount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const maintenancePaymentsChartData = {
        labels: ['المصروفات المدفوعة', 'المصروفات المتبقية'],
        datasets: [
            {
                data: [maintenancePayments.totalPaidAmount, maintenancePayments.totalRemainingAmount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const currentMonthMaintenancePaymentsChartData = {
        labels: ['المبلغ المحصل', 'المبلغ المتبقي'],
        datasets: [
            {
                data: [currentMonthMaintenancePayments.totalPaidAmount, currentMonthMaintenancePayments.totalRemainingAmount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const otherPaymentsChartData = {
        labels: ['المبلغ المحصل', 'المبلغ المتبقي'],
        datasets: [
            {
                data: [otherPayments.totalPaidAmount, otherPayments.totalRemainingAmount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    const currentMonthOtherPaymentsChartData = {
        labels: ['المبلغ المحصل', 'المبلغ المتبقي'],
        datasets: [
            {
                data: [currentMonthOtherPayments.totalPaidAmount, currentMonthOtherPayments.totalRemainingAmount],
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
            },
        ],
    };

    return (
          <Box sx={{p: {xs: 1, md: 3}}}>
              <Typography variant="h4" gutterBottom>
                  لوحة الموقع
              </Typography>

              <Grid container spacing={0} sx={{
                  flexDirection: "row-reverse",

              }}>
                  <Grid item xs={12} md={3} lg={3}>
                      <Card
                            sx={{
                                minWidth: 250,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "sticky"
                                , top: 0
                            }}
                      >
                          <CardContent>
                              <FormControl fullWidth>
                                  <InputLabel>اختر العقار</InputLabel>
                                  <Select value={selectedProperty} onChange={handlePropertyChange} displayEmpty>
                                      <MenuItem value="all">
                                          <em>جميع العقارات</em>
                                      </MenuItem>
                                      {properties.map((property) => (
                                            <MenuItem key={property.id} value={property.id}>
                                                {property.name}
                                            </MenuItem>
                                      ))}
                                  </Select>
                              </FormControl>
                          </CardContent>
                      </Card>
                  </Grid>

                  <Grid item xs={12} md={9} lg={9}>
                      <Grid container spacing={0} direction="column" sx={{
                          flexWrap: "nowrap"
                      }}>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["إجمالي الوحدات", "الوحدات المؤجرة", "الوحدات الشاغرة"]}
                                    values={[units.total, units.rented, units.nonRented]}
                                    loading={loadingUnits}
                                    chartData={unitsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["إجمالي العقود", "العقود النشطة", "العقود المنتهية"]}
                                    values={[agreements.total, agreements.active, agreements.expired]}
                                    loading={loadingAgreements}
                                    chartData={agreementsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["إجمالي الإيجارات", "الإيجار المحصل", "الإيجار المتبقي"]}
                                    values={[
                                        formatCurrencyAED(rentPayments.totalAmount),
                                        formatCurrencyAED(rentPayments.totalPaidAmount),
                                        formatCurrencyAED(rentPayments.totalRemainingAmount),
                                    ]}
                                    loading={loadingRentPayments}
                                    chartData={rentPaymentsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["إجمالي المدفوعات لهذا الشهر", "المبلغ المحصل", "المبلغ المتبقي"]}
                                    values={[
                                        formatCurrencyAED(currentMonthPayments.totalAmount),
                                        formatCurrencyAED(currentMonthPayments.totalPaidAmount),
                                        formatCurrencyAED(currentMonthPayments.totalRemainingAmount),
                                    ]}
                                    loading={loadingCurrentMonthPayments}
                                    chartData={currentMonthPaymentsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["جميع المصروفات", "المصروفات المدفوعة", "المصروفات المتبقية"]}
                                    values={[
                                        formatCurrencyAED(maintenancePayments.totalAmount),
                                        formatCurrencyAED(maintenancePayments.totalPaidAmount),
                                        formatCurrencyAED(maintenancePayments.totalRemainingAmount),
                                    ]}
                                    loading={loadingMaintenancePayments}
                                    chartData={maintenancePaymentsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["إجمالي المصروفات لهذا الشهر", "المبلغ المحصل", "المبلغ المتبقي"]}
                                    values={[
                                        formatCurrencyAED(currentMonthMaintenancePayments.totalAmount),
                                        formatCurrencyAED(currentMonthMaintenancePayments.totalPaidAmount),
                                        formatCurrencyAED(currentMonthMaintenancePayments.totalRemainingAmount),
                                    ]}
                                    loading={loadingCurrentMonthMaintenancePayments}
                                    chartData={currentMonthMaintenancePaymentsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["جميع المدفوعات الأخرى", "المبلغ المحصل", "المبلغ المتبقي"]}
                                    values={[
                                        formatCurrencyAED(otherPayments.totalAmount),
                                        formatCurrencyAED(otherPayments.totalPaidAmount),
                                        formatCurrencyAED(otherPayments.totalRemainingAmount),
                                    ]}
                                    loading={loadingOtherPayments}
                                    chartData={otherPaymentsChartData}
                              />
                          </Grid>
                          <Grid item xs={12}>
                              <CardComponent
                                    headers={["إجمالي المدفوعات الأخرى لهذا الشهر", "المبلغ المحصل", "المبلغ المتبقي"]}
                                    values={[
                                        formatCurrencyAED(currentMonthOtherPayments.totalAmount),
                                        formatCurrencyAED(currentMonthOtherPayments.totalPaidAmount),
                                        formatCurrencyAED(currentMonthOtherPayments.totalRemainingAmount),
                                    ]}
                                    loading={loadingCurrentMonthOtherPayments}
                                    chartData={currentMonthOtherPaymentsChartData}
                              />
                          </Grid>
                      </Grid>
                  </Grid>
              </Grid>
          </Box>
    );
};

export default Dashboard;
