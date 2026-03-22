import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

export default function AddDoctors() {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [formData, setFormData] = useState({});

  type FormValues = {
    nationalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialization: string;
    gender: string;
    yearsOfExperience: string;
    address: string;
    biography: string;
  };

  const FieldBox: React.FC<{ children: React.ReactNode; flex?: number }> = ({
    children,
    flex = 1,
  }) => <Box sx={{ flex }}>{children}</Box>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nationalId: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialization: "",
      gender: "",
      yearsOfExperience: "",
      address: "",
      biography: "",
    },
  });

  const inputItem = (inputName: keyof FormValues, label: string) => {
    return (
      <FieldBox>
        <Controller
          name={inputName}
          control={control}
          rules={{ required: `${label} is required` }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              variant="outlined"
              label={label}
              error={!!errors[inputName]}
              helperText={(errors[inputName]?.message as string) ?? ""}
            />
          )}
        />
      </FieldBox>
    );
  };

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold" mb="20px">
        Add New Doctor
      </Typography>
      <form onSubmit={handleSubmit((data) => setFormData(data))}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns={isNonMobile ? "repeat(4, 1fr)" : "repeat(1, 1fr)"}
          sx={{
            maxWidth: 1000,
            mx: "auto",
            "& .MuiOutlinedInput-root": {
              mb: "15px",
              color: "var(--text-color)",
              borderColor: "var(--border-color)",
              backgroundColor: "var(--input-bg-color)",
              borderRadius: "6px",
              "&:hover": {
                borderColor: "var(--active-menu-item-color)",
                backgroundColor: "var(--input-bg-color)",
                "& .MuiOutlinedInput-input": {
                  color: "var(--text-color)",
                },
              },
            },
            "& .MuiOutlinedInput-input::placeholder": {
              color: "var(--muted-color)",
              opacity: 1,
            },
            "& .MuiInputLabel-root": {
              color: "var(--muted-color)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--active-menu-item-color)",
            },
            "& .MuiSelect-icon": {
              color: "var(--text-color)",
              fontSize: "1.5rem",
            },
            "& .MuiFormHelperText-root": {
              color: "var(--error-color)",
            },
            "& .Mui-focused .MuiInputLabel-root": {
              color: "var(--active-menu-item-color)",
            },
            "& .MuiRadio-root": {
              color: "var(--text-color)",
            },
            "& .MuiRadio-root.Mui-checked": {
              color: "var(--active-menu-item-color)",
            },
          }}
        >
          {inputItem("nationalId", "National ID")}
          {inputItem("firstName", "First Name")}
          {inputItem("lastName", "Last Name")}
          {inputItem("email", "Email")}
          {inputItem("phone", "Phone Number")}

          <FieldBox>
            <Controller
              name="specialization"
              control={control}
              rules={{ required: "Specialization is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.specialization}>
                  <InputLabel>Specialization</InputLabel>
                  <Select {...field} label="Specialization">
                    <MenuItem value="Cardiology">Cardiology</MenuItem>
                    <MenuItem value="Dermatology">Dermatology</MenuItem>
                    <MenuItem value="Neurology">Neurology</MenuItem>
                    <MenuItem value="Pediatrics">Pediatrics</MenuItem>
                    <MenuItem value="Psychiatry">Psychiatry</MenuItem>
                    <MenuItem value="Radiology">Radiology</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.specialization?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </FieldBox>

          <FieldBox>
            <Controller
              name="yearsOfExperience"
              control={control}
              rules={{ required: "Years of Experience is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  variant="outlined"
                  label="Years of Experience"
                  type="number"
                  error={!!errors.yearsOfExperience}
                  helperText={(errors.yearsOfExperience?.message as string) ?? ""}
                />
              )}
            />
          </FieldBox>

          <FieldBox>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.gender}>
                  <InputLabel shrink>Gender</InputLabel>
                  <RadioGroup
                    row
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  >
                    <FormControlLabel
                      value="male"
                      control={
                        <Radio
                          sx={{
                            color: "var(--muted-color)",
                            "&.Mui-checked": {
                              color: "var(--primary-color)",
                            },
                            "&:hover": {
                              backgroundColor: "rgba(98, 0, 234, 0.08)",
                              borderRadius: "50%",
                            },
                          }}
                        />
                      }
                      label="Male"
                    />
                    <FormControlLabel
                      value="female"
                      control={
                        <Radio
                          sx={{
                            color: "var(--muted-color)",
                            "&.Mui-checked": {
                              color: "var(--secondary-color)",
                            },
                            "&:hover": {
                              backgroundColor: "rgba(3, 218, 198, 0.08)",
                              borderRadius: "50%",
                            },
                          }}
                        />
                      }
                      label="Female"
                    />
                  </RadioGroup>
                  <FormHelperText>{errors.gender?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </FieldBox>
        </Box>

        <Box display="flex" justifyContent="center" mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>

      {Object.keys(formData).length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Form Data:</Typography>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
}
