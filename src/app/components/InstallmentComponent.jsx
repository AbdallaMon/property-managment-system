import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Box, FormControl, Grid, TextField, Typography} from "@mui/material";
import {Controller} from "react-hook-form";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

const RentCollectionType = {
    TWO_MONTHS: 2,
    THREE_MONTHS: 3,
    FOUR_MONTHS: 4,
    SIX_MONTHS: 6,
    ONE_YEAR: 12,
};


export function InstallmentComponent({getValues, control, register, errors, setValue, data}) {
    const [dataState, setData] = useState(data)
    let {rentCollectionType, startDate, endDate, totalPrice, discount} = dataState;
    const [installments, setInstallments] = useState([]);

    useEffect(() => {
        if (getValues()) {
            window.setTimeout(() => {

                setData(getValues())
            }, 100)
        }
    }, [getValues])
    useEffect(() => {
        if (data.rentCollectionType && data.startDate && data.endDate && data.totalPrice) {
            setData(data)
        }
    }, [data])
    useEffect(() => {
        setValue("installments", installments);
    }, [installments]);

    useEffect(() => {
        if (rentCollectionType && startDate && endDate && totalPrice) {
            calculateInstallments();
        }
    }, [rentCollectionType, startDate, endDate, totalPrice, discount]);

    const calculateInstallments = () => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);

        const monthDifference = end.startOf('month').diff(start.startOf('month'), 'month');

        const totalInstallments = Math.ceil(
              monthDifference / RentCollectionType[rentCollectionType]
        );

        const discountedPrice = totalPrice - (discount || 0);
        const installmentBaseAmount = discountedPrice / totalInstallments;
        let remainingAmount = discountedPrice;

        const newInstallments = Array(totalInstallments)
              .fill()
              .map((_, i) => {
                  let dueDate = start.add(i * RentCollectionType[rentCollectionType], 'month');
                  let endDate = dueDate.add(RentCollectionType[rentCollectionType], 'month');

                  let installmentAmount;
                  if (i === totalInstallments - 1) {
                      installmentAmount = remainingAmount;
                  } else {
                      installmentAmount = Math.round(installmentBaseAmount / 50) * 50;
                      remainingAmount -= installmentAmount;
                  }
                  setValue(`installments[${i}].dueDate`, dueDate.format("YYYY-MM-DD"));
                  setValue(`installments[${i}].amount`, installmentAmount);

                  return {
                      startDate: start.format("YYYY-MM-DD"),
                      dueDate: dueDate.format("YYYY-MM-DD"),
                      endDate: endDate.format("YYYY-MM-DD"),
                      amount: installmentAmount,
                  };
              });

        setInstallments(newInstallments);
    };

    return (
          <Box mt={3}>
              {installments.map((installment, index) => (
                    <Box key={index} mb={3} p={3} border={1} borderRadius={2} borderColor="grey.300">
                        <Typography variant="h6" mb={2}>الدفعه {index + 1}</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={!!errors[`installments[${index}].dueDate`]}>
                                    <Controller
                                          name={`installments[${index}].dueDate`}
                                          control={control}
                                          defaultValue={installment.dueDate ? dayjs(installment.dueDate) : null}
                                          rules={{
                                              required: {
                                                  value: true,
                                                  message: "يرجى إدخال تاريخ الاستحقاق",
                                              },
                                          }}
                                          render={({field: {onChange, value}, fieldState: {error}}) => (
                                                <DatePicker
                                                      id={`installments[${index}].dueDate`}
                                                      label="تاريخ الاستحقاق"
                                                      value={value ? dayjs(value) : null}
                                                      onChange={(date) => {
                                                          onChange(date ? date.format("YYYY-MM-DD") : null);
                                                      }}
                                                      renderInput={(params) => (
                                                            <TextField
                                                                  {...params}
                                                                  error={!!error}
                                                                  helperText={error ? error.message : ""}
                                                                  placeholder="DD/MM/YYYY"
                                                            />
                                                      )}
                                                />
                                          )}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                      fullWidth
                                      id={`installments[${index}].amount`}
                                      label="المبلغ"
                                      type="number"
                                      variant="outlined"
                                      defaultValue={installment.amount}
                                      {...register(`installments[${index}].amount`, {
                                          required: {
                                              value: true,
                                              message: "يرجى إدخال المبلغ",
                                          },
                                          min: {
                                              value: 1,
                                              message: "المبلغ يجب أن يكون أكبر من 0",
                                          },
                                      })}
                                      error={!!errors[`installments[${index}].amount`]}
                                      helperText={errors[`installments[${index}].amount`] ? errors[`installments[${index}].amount`].message : ""}
                                />
                            </Grid>
                        </Grid>
                    </Box>
              ))}
          </Box>
    );
}
