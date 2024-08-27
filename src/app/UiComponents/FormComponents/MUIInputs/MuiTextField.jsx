import { useState } from "react";
import { TextField } from "@mui/material";

export function MuiTextField({
  input,
  variant = "contained",
  register,
  errors,
}) {
  const inputData = input.data;
  return (
    <TextField
      fullWidth
      sx={input.sx && input.sx}
      className={"mb-3"}
      defaultValue={input.value}
      disabled={input.disabled}
      variant={variant}
      // value={value}
      error={Boolean(errors[inputData.id])}
      // onChange={(e) => setValue(e.target.value)}
      helperText={errors[inputData.id]?.message}
      {...inputData}
      {...register(inputData.id, input.pattern)}
    />
  );
}
