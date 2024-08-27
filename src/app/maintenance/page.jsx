// pages/maintenance.jsx
"use client";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import NormalMaintenance from "@/app/components/NormalMaintenance";
import MaintenanceContracts from "@/app/components/MaintenanceContracts";
import TableFormProvider from "@/app/context/TableFormProvider/TableFormProvider";

export default function MaintenancePage() {
  const [view, setView] = useState("normal");

  return (
    <TableFormProvider url={"fast-handler"}>
      <Box>
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color={view === "normal" ? "primary" : "secondary"}
            onClick={() => setView("normal")}
          >
            الصيانة العادية
          </Button>
          <Button
            variant="contained"
            color={view === "contract" ? "primary" : "secondary"}
            onClick={() => setView("contract")}
          >
            عقود الصيانة
          </Button>
        </Box>
        {view === "normal" ? <NormalMaintenance /> : <MaintenanceContracts />}
      </Box>
    </TableFormProvider>
  );
}
