import {Modal, Box, Typography, Button} from "@mui/material";
import { Form } from "@/app/UiComponents/FormComponents/Forms/Form";
import React, { useEffect, useState } from "react";
import {useToastContext} from "@/app/context/ToastLoading/ToastLoadingProvider";
import {useRouter} from "next/navigation";
import {rentAgreementInputs} from "@/app/rent/rentInputs";
import {submitRentAgreement} from "@/services/client/createRentAgreement";
export const RenewRent = ({ data, setData }) => {
  const [renewModalOpen, setRenewModalOpen] = useState(false);
  const [renewData, setRenewData] = useState(null);
  const { setLoading: setSubmitLoading } = useToastContext();
  const [propertyId, setPropertyId] = useState(data.unit.property.id);
  const [disabled, setDisabled] = useState({
    unitId: false,
  });
  const [reFetch, setRefetch] = useState({
    unitId: false,
  });

  const router = useRouter();

  const handleOpenRenewModal = (rentData) => {
    setRenewData(rentData);
    setRenewModalOpen(true);
  };

  const handleCloseRenewModal = () => {
    setRenewModalOpen(false);
    setRenewData(null);
  };

  async function getRenters() {
    const res = await fetch("/api/fast-handler?id=renter");
    const data = await res.json();

    return { data };
  }

  async function getRentTypes() {
    const res = await fetch("/api/fast-handler?id=rentType");
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.title,
      };
    });
    return { data: dataWithLabel };
  }

  async function getProperties() {
    const res = await fetch("/api/fast-handler?id=properties");
    const data = await res.json();
    return { data };
  }

  function handlePropertyChange(value) {
    setPropertyId(value);
    setDisabled({
      ...disabled,
      unitId: false,
    });
    setRefetch({
      ...reFetch,
      unitId: true,
    });
  }

  async function getUnits() {
    const res = await fetch(
          "/api/fast-handler?id=unit&propertyId=" + propertyId,
    );
    const data = await res.json();
    const dataWithLabel = data.map((item) => {
      return {
        ...item,
        name: item.unitId,
        disabled: item.rentAgreements?.some((rent) => rent.status === "ACTIVE"),
      };
    });

    return { data: dataWithLabel, id: propertyId };
  }

  async function getRentCollectionType() {
    const data = [
      { id: "TWO_MONTHS", name: "شهرين" },
      { id: "THREE_MONTHS", name: "ثلاثة أشهر" },
      { id: "FOUR_MONTHS", name: "أربعة أشهر" },
      { id: "SIX_MONTHS", name: "ستة أشهر" },
      { id: "ONE_YEAR", name: "سنة واحدة" },
    ];
    return { data };
  }

  const dataInputs = rentAgreementInputs.map((input) => {
    switch (input.data.id) {
      case "rentCollectionType":
        return {
          ...input,
          extraId: false,
          getData: getRentCollectionType,
        };
      case "renterId":
        return {
          ...input,
          extraId: false,
          getData: getRenters,
        };
      case "typeId":
        return {
          ...input,
          extraId: false,
          getData: getRentTypes,
        };
      case "propertyId":
        return {
          ...input,
          getData: getProperties,
          onChange: handlePropertyChange,
        };
      case "unitId":
        return {
          ...input,
          getData: getUnits,
        };
      default:
        return input;
    }
  });
  const handleRenewSubmit = async (data) => {
    const extraData = { otherExpenses: [] };
    data = { ...data, extraData };
    const returedData = await submitRentAgreement(
          { ...data },
          setSubmitLoading,
          "PUT",
          [
            {
              route: `/${renewData.id}?installments=true`,
              message: "جاري البحث عن اي دفعات لم يتم استلامها...",
            },
            {
              route: `/${renewData.id}?feeInvoices=true`,
              message: "جاري البحث عن اي رسوم لم يتم دفعها...",
            },
            {
              route: `/${renewData.id}?otherExpenses=true`,
              message: "جاري البحث عن اي مصاريف اخري لم يتم دفعها...",
            },
            {
              route: `/${renewData.id}?renew=true`,
              message: "جاري تحديث حالة العقد القديم...",
            },
          ],
    );
    if (!returedData) return;
    if(setData){
      setData((prevData) => {
        return prevData.map((item) => {
          return item.id !== renewData.id
        });
      });
    }else{

    router.push("/rent/" + returedData.id);
    }
    handleCloseRenewModal();
  };

  return (
        <>
          <Button
                variant="contained"
                color="secondary"
                onClick={() => handleOpenRenewModal(data)}
          >
            تجديد العقد
          </Button>
          <RenewRentModal
                open={renewModalOpen}
                handleClose={handleCloseRenewModal}
                initialData={renewData}
                inputs={dataInputs}
                onSubmit={handleRenewSubmit}
          />
        </>
  );
};

export function RenewRentModal({
  open,
  handleClose,
  initialData,
  inputs,
  onSubmit,
  children,
}) {
  const [modalInputs, setModalInputs] = useState([]);

  useEffect(() => {
    function createInputs() {
      inputs[0] = {
        data: {
          id: "propertyId",
          label: "العقار",
          type: "text",
          name: "propertyId",
          disabled: true,
        },
        value: initialData?.unit.property.name,
        sx: {
          width: {
            xs: "100%",
            sm: "48%",
          },
          mr: "auto",
        },
      };
      inputs[1] = {
        data: {
          id: "unitNumber",
          label: "معرف الوحدة",
          type: "text",
          disabled: true,
        },

        value: initialData?.unit.unitId,
        sx: {
          width: {
            xs: "100%",
            sm: "48%",
          },
        },
      };
      inputs[inputs.length] = {
        data: {
          id: "unitId",
          label: "الوحدة",
          type: "text",
          name: "unitId",
        },
        sx: {
          width: {
            xs: "100%",
            sm: "48%",
          },
          display: "none",
        },
      };

      const newInputs =
        initialData &&
        inputs.map((input) => {
          if (input.data.id === "propertyId" || input.data.id === "unitNumber")
            return input;
          return { ...input, value: initialData[input.data.id] };
        });
      setModalInputs(newInputs);
    }

    createInputs();
  }, [open, initialData]);

  if (!open) return null;
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: {
            xs: "90%",
            md: "750px",
            lg: "850px",
          },
          height: "90%",
          overflowY: "auto",
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: {
            xs: 1,
            sm: 2,
            md: 4,
          },
        }}
      >
        <Typography variant="h6" component="h2">
          تجديد عقد الإيجار
        </Typography>
        <Form
          formTitle={"تجديد عقد الإيجار"}
          inputs={modalInputs}
          onSubmit={onSubmit}
          variant={"outlined"}
          btnText={"تجديد"}
          initialData={initialData}
        >
          {children}
        </Form>
      </Box>
    </Modal>
  );
}
