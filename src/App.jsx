import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Typography,
  Container,
  Paper,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  FormControlLabel,
  FormHelperText,
  Checkbox,
  FormLabel,
  CircularProgress,
  MenuItem,
  FormControl,
  Button,
  TextField,
  Select,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TimerIcon from "@mui/icons-material/Timer";
import { url } from "./api/url";
import {
  allOutOfServices,
  allPackage,
  allVehicleType,
  createBooking,
} from "./api/apis";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Invoice from "./Invoice";
const App = () => {
  const [allDataVehicleTypes, setAllDataVehicleTypes] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [outOfService, setOutOfService] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [packagePrice, setPackagePrice] = useState(null);
  const [vehicleImage, setVehicleImage] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState({
    date: "",
    time: "",
  });
  const [packageName, setpackageName] = useState(null);
  const [sendDate, setSendDate] = useState();
  const [vehicleName, setvehicleName] = useState(null);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  const date = Date.now();
  const timeSlots = [
    {
      date: Date.Now,
      times: [
        "8:00AM",
        "9:00AM",
        "10:00AM",
        "11:00AM",
        "12:00PM",
        "1:00PM",
        "2:00PM",
        "3:00PM",
        "4:00PM",
        "5:00PM",
        "6:00PM",
        "7:00PM",
        "8:00PM",
      ],
    },
  ];

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "Too short")
      .max(50, "Max 50 characters")
      .matches(/^[A-Za-z\s]+$/, "No special characters")
      .required("First Name is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    phone: Yup.string()
      .matches(
        /^[+]?[0-9]{1,4}[.\-\s]?(\(?\d{1,3}\)?[\.\-\s]?)?[\d\.\-\s]{5,20}$/,
        "Invalid phone number"
      )
      .required("Phone Number is required"),

    address: Yup.string()
      .max(250, "Max 250 characters")
      .matches(/^[A-Za-z0-9\s,.-]+$/, "No special characters allowed")
      .required("Address is required"),

    paymentType: Yup.string().required("Payment Type required"),

    termsAndConditions: Yup.bool().required("You must agree to the Terms"),
  });

  const handleInvoiceClose = () => setOpenInvoice(false);
  const filteredSlots = timeSlots.map((slot) => ({
    date: selectedDate,
    times: slot.times,
  }));

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedSlot({ date: "", time: "" });
    setSelectedDate(newDate);
    setSelectedSlots([]);
  };

  const handleSlotSelect = (date, time) => {
    const slotIdentifier = `${date} ${time}`;
    setSelectedSlots([slotIdentifier]);
    const selectedSlotConfirm = `${moment(date).format("MM-DD-YYYY")} ${time}`;

    console.log(`seconde selectedSlot`, selectedSlotConfirm);

    setSendDate(selectedSlotConfirm);

    setSelectedSlot({ date, time });
  };

  function generateRandom6DigitNumber() {
    return Math.floor(Math.random() * 900000) + 100000;
  }
  let lastUsedNumber = generateRandom6DigitNumber();
  function generateUniqueId(prefix = "BID") {
    prefix = prefix.toUpperCase().slice(0, 3);
    const currentNumber = lastUsedNumber++;
    const formattedNumber = currentNumber.toString().padStart(7, "0");
    const uniqueId = `${prefix}${formattedNumber}`;
    if (lastUsedNumber > 9999999) {
      lastUsedNumber = 1;
    }

    return uniqueId;
  }
  const downloadInvoice = (submittedData) => {
    const doc = new jsPDF();
    doc.text("Booking Invoice", 14, 16);

    doc.autoTable({
      startY: 40,
      head: [["Field", "Details"]],
      body: [
        ["booking Id "],
        ["Name", submittedData.name],
        ["Email", submittedData.email],
        ["Your Vehicle", submittedData.vehicleName],
        ["Amount", submittedData.packagePrice],
        ["Time & Date", submittedData.dateSelected],
      ],
    });

    doc.save("invoice.pdf");
  };
  const fetchVehicleTypes = async () => {
    try {
      const com_url = `${url.base_url}${url.vehicle_type.all}`;
      const response = await allVehicleType(com_url);

      if (response) {
        setAllDataVehicleTypes(response.data);
      }
    } catch (error) {
      toast.error(`Error Fetching Data`);
    }
  };
  const fetchPackageData = async () => {
    try {
      const com_url = `${url.base_url}${url.package.all}`;
      const response = await allPackage(com_url);

      if (response || response.data[0]) {
        setPackageData(response.data);
      }
    } catch (error) {
      toast.error(`Error Fetching Data`);
    }
  };
  const fetchOutOfServiceDate = async () => {
    try {
      const com_url = `${url.base_url}${url.out_of_service.all}`;
      const response = await allOutOfServices(com_url);
    } catch (error) {
      toast.error(`Error Fetching Data`);
    }
  };

  const LoaderOverlay = () => (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <CircularProgress color="error" size={50} />
    </Box>
  );
  useEffect(() => {
    fetchVehicleTypes();
    fetchPackageData();
    fetchOutOfServiceDate();
    setSelectedDate(timeSlots[0]?.date);
  }, []);

  return (
    <Container sx={{ marginTop: "20px" }}>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          companyName: "",
          email: "",
          phone: "",
          address: "",
          message: "",
          paymentType: "default",
          advancePayment: "0",
          termsAndConditions: false,
        }}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values, { resetForm }) => {
          setLoading(true);

          let dateSelected = sendDate;
          let bookingId = generateUniqueId();

          const submittedData = {
            // bookingId: bookingId,
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            phone: values.phone,
            address: values.address,
            message: values.message,
            companyName: values.companyName,
            vehicleName,
            paymentType: values.paymentType,
            packageName,
            packagePrice,
            vehicleId,
            packageId,
            dateSelected,
            termsAndConditions: values.termsAndConditions,
            advancePayment: parseInt(values.advancePayment),
          };

          try {
            console.log(`submittedData`, submittedData);
            const com_url = `${url.base_url}${url.booking.create}`;
            const response = await createBooking(com_url, submittedData);
            console.log(`response`, response);
            if (response) {
              setLoading(false);
              setpackageName(null);
              setvehicleName(null);
              setSelectedSlots([]);
              setOpenInvoice(true);
              setResponse(response.data);
              () => {
                downloadInvoice(response.data);
              };
              toast.success(
                "Successfully Booked And Invoice Sent to your mail",
                {
                  autoClose: 5000,
                  position: "top-right",
                }
              );

              resetForm();
            } else {
              setLoading(false);
              toast.error("Not Booked - Error", {
                autoClose: 5000,
                position: "top-right",
              });
            }
          } catch (error) {
            setLoading(false);
            toast.error("An error occurred while processing the booking", {
              autoClose: 5000,
              position: "top-right",
            });
            console.error("Error:", error);
          }
        }}
      >
        {({ touched, errors, handleChange, handleBlur, values }) => (
          <Form>
            {/* //1st  */}
            <Box>
              <Box
                sx={{
                  backgroundColor: "red",
                  padding: "10px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Service Category
              </Box>
              <Paper
                elevation={3}
                sx={{
                  padding: "20px",
                  alignItems: "center",
                  gap: "20px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      backgroundColor: "#00bcd4",
                      color: "white",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      fontSize: "18px",
                    }}
                  >
                    1/5
                  </Box>
                  <div>
                    <Typography variant="h5">Category</Typography>
                    <Typography>Select service category below</Typography>
                  </div>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "25px",
                    marginTop: "20px",
                    marginBottom: "20px",
                  }}
                >
                  {allDataVehicleTypes.map((vehicle, index) => (
                    <Card
                      key={index}
                      sx={{
                        width: 200,
                        height: 150,
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        border:
                          vehicleName === vehicle.vehicleName
                            ? "2px solid red"
                            : "none",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                      onClick={() => {
                        setvehicleName(vehicle.vehicleName);
                        setVehicleImage(vehicle.vehicleImage);
                        setVehicleId(vehicle._id);
                      }}
                    >
                      <Box sx={{ position: "relative", height: "100%" }}>
                        <CardMedia
                          component="img"
                          height="100"
                          image={`http://localhost:8080/${vehicle.vehicleImage}`}
                          alt={vehicle.vehicleName}
                          sx={{ objectFit: "contain" }}
                        />

                        <Typography
                          variant="h6"
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            color: "white",
                            textAlign: "center",
                            padding: "4px",
                          }}
                        >
                          {vehicle.vehicleName}
                        </Typography>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* //2nd */}
            <Box>
              <Box
                sx={{
                  marginTop: "20px",
                  backgroundColor: "red",
                  padding: "10px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Packages
              </Box>
              <Paper
                elevation={3}
                sx={{
                  padding: "20px",
                  alignItems: "center",
                  gap: "20px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      backgroundColor: "#00bcd4",
                      color: "white",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      fontSize: "18px",
                    }}
                  >
                    2/5
                  </Box>
                  <div>
                    <Typography variant="h5">Packages</Typography>
                    <Typography>Select packages below</Typography>
                  </div>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  {packageData
                    .filter(
                      (item) =>
                        vehicleName === null ||
                        vehicleName === item.type.vehicleName
                    )
                    .map((item, index) => (
                      <Card
                        key={index}
                        sx={{
                          width: 240,
                          height: "auto",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          background:
                            "linear-gradient(135deg, #ffffff, #f3f4f6)",
                          borderRadius: "15px",
                          border:
                            packageName === item.name
                              ? "2px solid #ff5722"
                              : "2px solid #e0e0e0",
                          boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 5px 25px rgba(0, 0, 0, 0.2)",
                          },
                        }}
                        onClick={() => {
                          setpackageName(item.name);
                          setPackagePrice(item.price);
                          setPackageId(item._id);
                        }}
                      >
                        <CardContent sx={{ padding: "20px" }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: "#2d3436",
                              mb: 1,
                              fontSize: "1.1rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {item.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#616161",
                              mb: 1,
                              fontSize: "0.95rem",
                            }}
                          >
                            <AccessTimeIcon
                              sx={{ fontSize: 20, mr: 0.5, color: "#ff9800" }}
                            />
                            Duration: {item.hours}h {item.minutes}m
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              color: "#4caf50",
                              fontSize: "1rem",
                              fontWeight: "500",
                            }}
                          >
                            <AttachMoneyIcon sx={{ fontSize: 20, mr: 0.5 }} />
                            {item.price}
                          </Typography>

                          <Button
                            onClick={() => setShowDescription(!showDescription)}
                            sx={{
                              mt: 2,
                              color: "#ff5722",
                              textTransform: "none",
                              fontSize: "0.9rem",
                            }}
                          >
                            {showDescription ? "Hide Details" : "Show Details"}
                          </Button>

                          {showDescription && (
                            <Typography
                              variant="body2"
                              sx={{
                                mt: 2,
                                color: "#616161",
                                fontSize: "0.95rem",
                                fontStyle: "italic",
                              }}
                            >
                              {item.desc}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </Paper>
            </Box>

            {/* //3rd */}
            <Box>
              <Box
                sx={{
                  marginTop: "20px",
                  backgroundColor: "red",
                  padding: "10px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Date & Time
              </Box>

              <Paper
                elevation={3}
                sx={{
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                <Box sx={{ padding: "20px" }}>
                  <Box
                    sx={{
                      backgroundColor: "#00bcd4",
                      color: "white",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      fontSize: "18px",
                    }}
                  >
                    3/5
                  </Box>

                  <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                    Block your time slots
                  </Typography>
                  <Typography sx={{ marginBottom: "10px" }}>
                    Select time slots below
                  </Typography>

                  <Paper
                    sx={{ padding: "20px", maxWidth: "1100px", margin: "auto" }}
                  >
                    <TextField
                      type="date"
                      value={selectedDate}
                      onChange={handleDateChange}
                      sx={{ marginBottom: "20px" }}
                      inputProps={{
                        min: moment().format("YYYY-MM-DD"),
                      }}
                    />

                    <Grid container spacing={2} sx={{ marginBottom: "20px" }}>
                      {filteredSlots.map((slot, index) => (
                        <Grid item xs={12} key={index}>
                          <Typography variant="h6">
                            {moment(slot.date).format("MM/DD/YYYY")}
                          </Typography>
                          <Grid container spacing={1}>
                            {slot.times.map((time, timeIndex) => {
                              console.log(`time`, time);
                              let currentTime = moment().format("HH:mm");
                              console.log(
                                `moment time ${moment().format("HH:mm")}`
                              );
                              if (time < currentTime) {
                                console.log(`in right path`);
                              }

                              const slotIdentifier = `${slot.date} ${time}`;
                              const isSelected =
                                selectedSlots.includes(slotIdentifier);
                              return (
                                <Grid
                                  item
                                  key={timeIndex}
                                  sx={{ marginTop: "10px" }}
                                >
                                  <Button
                                    variant="contained"
                                    sx={{
                                      backgroundColor: isSelected
                                        ? "red"
                                        : "#4caf50",
                                      color: "white",
                                      borderRadius: "20px",
                                      width: "70px",
                                      border: isSelected
                                        ? "2px solid white"
                                        : "none",
                                      "&:hover": {
                                        backgroundColor: isSelected
                                          ? "darkred"
                                          : "#45a049",
                                      },
                                    }}
                                    onClick={() =>
                                      handleSlotSelect(slot.date, time)
                                    }
                                  >
                                    {time}
                                  </Button>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              </Paper>
            </Box>

            {/* //4th */}
            <Box
              sx={{
                marginTop: "20px",
                backgroundColor: "red",
                padding: "10px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Summary
            </Box>
            <Paper
              elevation={3}
              sx={{
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                backgroundColor: "#f0f0f0",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#00bcd4",
                  color: "white",
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  fontSize: "18px",
                }}
              >
                4/5
              </Box>
              <Typography variant="h5">Summary</Typography>
              <Typography>Booking details below</Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CalendarTodayIcon
                      sx={{ paddingRight: "20px" }}
                      fontSize="large"
                    />
                    <div>
                      {selectedSlot ? (
                        <>
                          <Typography variant="body2">
                            Appointment Date -
                          </Typography>
                          <Typography variant="body2">
                            {moment(selectedSlot.date).format("MM-DD-YYYY")}
                          </Typography>
                        </>
                      ) : (
                        <Typography>Yet to Choose..</Typography>
                      )}
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <AccessTimeIcon
                      fontSize="large"
                      sx={{ paddingRight: "20px" }}
                    />
                    <div>
                      {selectedSlot ? (
                        <>
                          <Typography variant="body2">
                            Appointment Time -
                          </Typography>
                          <Typography variant="body2">
                            {selectedSlot.time}
                          </Typography>
                        </>
                      ) : (
                        <Typography>Yet to Choose..</Typography>
                      )}
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "30px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <TimerIcon fontSize="large" sx={{ paddingRight: "20px" }} />
                    <div>
                      {vehicleName ? (
                        <>
                          <Typography variant="body2">
                            Service Category -
                          </Typography>
                          <Typography variant="body2">
                            <strong>{vehicleName}</strong>
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="body2">
                            Service Category -
                          </Typography>
                          <Typography variant="body2">
                            Yet to Choose..
                          </Typography>
                        </>
                      )}
                    </div>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "30px",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ShoppingCartIcon
                      fontSize="large"
                      sx={{ paddingRight: "20px" }}
                    />
                    <div>
                      <div>
                        {packagePrice ? (
                          <>
                            <Typography variant="body2">
                              Total Cost -
                            </Typography>
                            <Typography variant="body2">
                              <strong>₹ {packagePrice}.00</strong>
                            </Typography>
                          </>
                        ) : (
                          <>
                            <Typography variant="body2">
                              Service Category -
                            </Typography>
                            <Typography variant="body2">
                              Yet to Choose..
                            </Typography>
                          </>
                        )}
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>

            {/* //5th */}
            <Box>
              <ToastContainer />
              {loading && <LoaderOverlay />}
              <Box>
                <Box
                  sx={{
                    marginTop: "20px",
                    backgroundColor: "red",
                    padding: "10px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Basic Information
                </Box>
                <Paper
                  elevation={3}
                  sx={{ padding: "20px", backgroundColor: "#f0f0f0" }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#00bcd4",
                      color: "white",
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "8px",
                      fontSize: "18px",
                    }}
                  >
                    5/5
                  </Box>
                  <Typography variant="h5">Basic Information</Typography>

                  <Box width="100%" padding="30px">
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <FormLabel>First Name</FormLabel>
                        <Field
                          as={TextField}
                          name="firstName"
                          placeholder="Enter First Name"
                          fullWidth
                          size="small"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.firstName}
                          error={touched.firstName && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormLabel>Last Name</FormLabel>
                        <Field
                          as={TextField}
                          name="lastName"
                          placeholder="Enter Last Name"
                          fullWidth
                          size="small"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.lastName}
                          error={touched.lastName && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <FormLabel>Company Name</FormLabel>
                        <Field
                          as={TextField}
                          name="companyName"
                          placeholder="Enter Company Name"
                          fullWidth
                          size="small"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.companyName}
                          error={
                            touched.companyName && Boolean(errors.companyName)
                          }
                          helperText={touched.companyName && errors.companyName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <FormLabel>Email</FormLabel>
                        <Field
                          as={TextField}
                          name="email"
                          type="email"
                          placeholder="Email"
                          fullWidth
                          size="small"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          error={touched.email && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <FormLabel>Phone</FormLabel>
                        <Field
                          as={TextField}
                          name="phone"
                          type="tel"
                          placeholder="Phone"
                          fullWidth
                          size="small"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.phone}
                          error={touched.phone && Boolean(errors.phone)}
                          helperText={touched.phone && errors.phone}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <FormLabel>Address</FormLabel>
                        <Field
                          as={TextField}
                          name="address"
                          placeholder="Address"
                          fullWidth
                          size="small"
                          multiline
                          rows={4}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.address}
                          error={touched.address && Boolean(errors.address)}
                          helperText={touched.address && errors.address}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <FormLabel>Message</FormLabel>
                        <Field
                          as={TextField}
                          name="message"
                          placeholder="Message"
                          fullWidth
                          size="small"
                          multiline
                          rows={4}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.message}
                          error={touched.message && Boolean(errors.message)}
                          helperText={touched.message && errors.message}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  <Paper
                    elevation={3}
                    sx={{
                      marginBottom: "20px",
                      marginTop: "20px",
                      padding: "20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    <Typography>
                      We will confirm your appointment with you by phone or
                      email within 24 hours of receiving your request.
                    </Typography>

                    <FormControlLabel
                      control={
                        <Field
                          as={Checkbox}
                          name="termsAndConditions"
                          checked={values.termsAndConditions}
                          onChange={handleChange}
                        />
                      }
                      label={
                        <Typography variant="body1">
                          I agree to the Terms and Conditions
                        </Typography>
                      }
                    />
                    {!values.termsAndConditions && (
                      <FormHelperText error>
                        You must agree to the terms and conditions.
                      </FormHelperText>
                    )}

                    <Field as={Select} name="paymentType">
                      <MenuItem value="default" disabled>
                        Select Payment Type
                      </MenuItem>
                      <MenuItem value="Cash">Cash</MenuItem>
                      <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                    </Field>
                    {values.paymentType !== "default" && (
                      <Grid item xs={6} sm={5}>
                        <FormLabel>Advance Payment (₹)</FormLabel>
                        <Field
                          as={TextField}
                          name="advancePayment"
                          type="number"
                          placeholder="Enter advance payment"
                          fullWidth
                          size="small"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.advancePayment}
                          error={Boolean(errors.advancePayment)}
                        />
                      </Grid>
                    )}
                  </Paper>

                  <Grid item xs={12} sx={{ marginTop: "10px" }}>
                    <Button
                      variant="contained"
                      color="success"
                      type="submit"
                      disabled={!values.termsAndConditions || loading}
                      sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: "white" }} />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </Grid>
                </Paper>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>

      <Invoice
        open={openInvoice}
        handleClose={handleInvoiceClose}
        bookingDetails={response}
      />
    </Container>
  );
};
export default App;
