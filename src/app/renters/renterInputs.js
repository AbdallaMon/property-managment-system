// renterInputs.js
export const renterInputs = [
  {
    data: {
      id: "name",
      type: "text",
      label: "اسم المستأجر",
      name: "name",
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
    pattern: {
      required: {
        value: true,
        message: "يرجى إدخال اسم المستأجر",
      },
    },
  },
  {
    data: {
      id: "phone",
      type: "number",
      label: "رقم الهاتف",
      name: "phone",
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
  {
    data: {
      id: "email",
      type: "text",
      label: "الإيميل",
      name: "email",
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
      mr: "auto",
    },
  },
  {
    data: {
      id: "nationalId",
      type: "text",
      label: "هوية المستأجر",
      name: "nationalId",
    },
    sx: {
      width: {
        xs: "100%",
        md: "48%",
      },
    },
  },
];
