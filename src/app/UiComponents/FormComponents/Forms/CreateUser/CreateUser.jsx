"use client";
import {useEffect} from "react";
import {
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {useTableForm} from "@/app/context/TableFormProvider/TableFormProvider";

const PrivilegeArea = {
    HOME: "الرئيسية",
    FOLLOW_UP: "متابعة المستحقات",
    PROPERTY: "العقارات",
    UNIT: "الوحدات",
    RENT: "عقود الايجار",
    INVOICE: "الفواتير",
    MAINTENANCE: "الصيانه",
    REPORT: "التقارير",
    OWNER: "الملاك",
    RENTER: "المستاجرين",
    SETTING: "الاعدادات",
};

const CreateUserForm = (props) => {
    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        role,
        setRole,
        privileges,
        setPrivileges,
        data,
    } = props;
    const {id} = useTableForm();

    useEffect(() => {
        if (data && id) {
            const user = data.find((user) => user.id === id);
            if (user) {
                setName(user.name);
                setEmail(user.email);
                setRole(user.role);
                setPassword(user.password);

                const userPrivileges = user.privileges?.reduce((acc, priv) => {
                    acc[priv.area] = priv.privilege;
                    return acc;
                }, {});
                setPrivileges(userPrivileges);
            }
        } else {
            setEmail("");
            setName("");
            setPassword("");
            setRole("USER");

            const initialPrivileges = {};
            Object.keys(PrivilegeArea).forEach((area) => {
                initialPrivileges[area] = {area, canRead: true};
            });
            setPrivileges(initialPrivileges);
        }
    }, [data, id, setName, setEmail, setRole, setPassword, setPrivileges]);

    const handlePrivilegeChange = (area, field, value) => {
        setPrivileges((prevPrivileges) => {
            const updatedPrivileges = {...prevPrivileges};
            if (!updatedPrivileges[area]) {
                updatedPrivileges[area] = {area};
            }
            updatedPrivileges[area][field] = value;
            return updatedPrivileges;
        });
    };

    const handleSelectAll = (area) => {
        setPrivileges((prevPrivileges) => {
            const updatedPrivileges = {...prevPrivileges};

            updatedPrivileges[area] = {
                canRead: true,
                canWrite: true,
                canEdit: true,
                canDelete: true,
            };
            if (id) {
                updatedPrivileges[area].name = area;
            } else {
                updatedPrivileges[area].area = area;
            }
            return updatedPrivileges;
        });
    };

    return (
          <Container>
              <TextField
                    label="اسم المستخدم"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
              />
              <TextField
                    label="البريد الإلكتروني"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
              />
              {!id && (
                    <TextField
                          label="كلمة المرور"
                          type="password"
                          fullWidth
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          margin="normal"
                    />
              )}
              <FormControl fullWidth margin="normal">
                  <InputLabel>الدور</InputLabel>
                  <Select value={role} onChange={(e) => setRole(e.target.value)}>
                      <MenuItem value="ADMIN">مسؤول</MenuItem>
                      <MenuItem value="USER">مستخدم</MenuItem>
                  </Select>
              </FormControl>
              <Typography variant="h6" gutterBottom>
                  الامتيازات
              </Typography>
              {Object.entries(PrivilegeArea).map(([area, label]) => (
                    <Grid
                          container
                          spacing={2}
                          key={area}
                          sx={{
                              borderBottom: 1,
                              borderColor: "divider",
                              paddingBottom: 2,
                          }}
                    >
                        <Grid item xs={12}>
                            <div className={"flex gap-3 items-center mt-5"}>
                                <Typography
                                      variant="h6"
                                      sx={{
                                          fontWeight: 600,
                                      }}
                                >
                                    {label}
                                </Typography>
                                <Button
                                      variant="text"
                                      color="secondary"
                                      onClick={() => handleSelectAll(area)}
                                >
                                    تحديد الكل
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                  control={
                                      <Checkbox
                                            checked={privileges[area]?.canRead || false}
                                            onChange={(e) => {
                                                handlePrivilegeChange(area, "canRead", e.target.checked);
                                            }}
                                      />
                                  }
                                  label="قراءة"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                  control={
                                      <Checkbox
                                            checked={privileges[area]?.canWrite || false}
                                            onChange={(e) =>
                                                  handlePrivilegeChange(area, "canWrite", e.target.checked)
                                            }
                                      />
                                  }
                                  label="انشاء"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                  control={
                                      <Checkbox
                                            checked={privileges[area]?.canEdit || false}
                                            onChange={(e) =>
                                                  handlePrivilegeChange(area, "canEdit", e.target.checked)
                                            }
                                      />
                                  }
                                  label="تعديل"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <FormControlLabel
                                  control={
                                      <Checkbox
                                            checked={privileges[area]?.canDelete || false}
                                            onChange={(e) =>
                                                  handlePrivilegeChange(area, "canDelete", e.target.checked)
                                            }
                                      />
                                  }
                                  label="حذف"
                            />
                        </Grid>
                    </Grid>
              ))}
          </Container>
    );
};

export default CreateUserForm;
