"use client";
import TableFormProvider, {
  useTableForm,
} from "@/app/context/TableFormProvider/TableFormProvider";
import {Box, Button, FormControl, Select, Typography} from "@mui/material";
import { useDataFetcher } from "@/helpers/hooks/useDataFetcher";
import ViewComponent from "@/app/components/ViewComponent/ViewComponent";
import {useEffect, useState} from "react";

import Link from "next/link";
import { unitInputs } from "@/app/units/unitInputs";
import DeleteBtn from "@/app/UiComponents/Buttons/DeleteBtn";
import { formatCurrencyAED } from "@/helpers/functions/convertMoneyToArabic";
import MenuItem from "@mui/material/MenuItem";

export default function PropertyPage() {
  return (
    <TableFormProvider url={"fast-handler"}>
      <PropertyWrapper />
    </TableFormProvider>
  );
}

const PropertyWrapper = () => {
  const {
    data,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    setData,
    total,
    setTotal,
    setRender,
    setOthers,others
  } = useDataFetcher("main/units");
  const { id, submitData } = useTableForm();
  const [disabled, setDisabled] = useState();
const [properties,setProperties]=useState([])
  const [loadingProperty,setLoadingProperty]=useState(true)
  const [reFetch, setRefetch] = useState({});

  useEffect(()=>{
    async function fetchProperties(){
      setLoadingProperty(true)
      const propertiesData=await getProperties()
      setProperties(propertiesData.data)
      setLoadingProperty(false)
    }
    fetchProperties()
  },[])
  async function getUnitTypes() {
    const res = await fetch("/api/fast-handler?id=unitType");
    const data = await res.json();

    return { data };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();

    return { data };
  }

  unitInputs[2] = {
    ...unitInputs[2],
    extraId: false,
    getData: getUnitTypes,
  };
  unitInputs[0] = {
    ...unitInputs[0],
    data: {
      ...unitInputs[0].data,
      disabled: false,
    },
    value: null,
    extraId: false,
    getData: getProperties,
  };

  async function handleDelete(id) {
    const res = await submitData(
      null,
      null,
      id,
      "DELETE",
      null,
      null,
      "main/units",
    );

    const filterData = data.filter((item) => item.id !== res.id);
    setData(filterData);
    setTotal((old) => old - 1);
    if (page === 1 && total >= limit) {
      setRender((old) => !old);
    } else {
      setPage((old) => (old > 1 ? old - 1 : 1) || 1);
    }
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"units/" + params.row.id}>
          <Button variant={"text"}>{params.row.id}</Button>
        </Link>
      ),
    },

    {
      field: "property",
      headerName: "العقار",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <Link href={"/properties/" + params.row.property?.id}>
          <Button variant={"text"}>{params.row.property?.name}</Button>
        </Link>
      ),
    },
    {
      field: "number",
      headerName: "رقم الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "type",
      headerName: "نوع الوحدة",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => <>{params.row.type?.name}</>,
    },
    {
      field: "yearlyRentPrice",
      headerName: "سعر الإيجار السنوي",
      width: 200,
      printable: true,
      cardWidth: 48,
      renderCell: (params) => (
        <>{formatCurrencyAED(params.row.yearlyRentPrice)}</>
      ),
    },
    {
      field: "electricityMeter",
      headerName: "رقم عداد الكهرباء",
      width: 200,
      printable: true,
      cardWidth: 48,
    },

    {
      field: "floor",
      headerName: "الدور",
      width: 200,
      printable: true,
      cardWidth: 48,
    },
    {
      field: "actions",
      width: 250,
      printable: false,
      renderCell: (params) => (
        <>
          <DeleteBtn handleDelete={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];
  function handlePropertyFilterChange(event) {
    setOthers("propertyId=" + event.target.value);
  }

  return (
    <>
      <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              alignItems: "center",
            }}
      >
        <FormControl sx={{ mb: 2, maxWidth: 300 }}>
          <Typography variant="h6">العقار </Typography>
          <Select
                value={others.split("=")[1] || "all"}
                onChange={handlePropertyFilterChange}
                displayEmpty
                fullWidth
                loading={loadingProperty}
          >
            <MenuItem value="all">حميع العقارات </MenuItem>
            {properties?.map((property) => (
                  <MenuItem value={property.id} key={property.id}>
                    {property.name}
                  </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <ViewComponent
        inputs={unitInputs}
        formTitle={" وحده جديده"}
        totalPages={totalPages}
        rows={data}
        columns={columns}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        id={id}
        loading={loading}
        setData={setData}
        setTotal={setTotal}
        total={total}
        noModal={true}
        disabled={disabled}
        reFetch={reFetch}
        url={"main/units"}
      ></ViewComponent>
    </>
  );
};
