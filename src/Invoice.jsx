import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "./assets/car_wash_logo.jpg";

const Invoice = ({ bookingDetails, open, handleClose }) => {
  let splitDate = bookingDetails?.dateSelected?.split(" ");
  let reverseDate = splitDate?.reverse();
  let finalDate = reverseDate?.join(" ");

  const downloadInvoice = () => {
    const doc = new jsPDF("p", "mm", [148, 210]);

    doc.addImage(logo, "JPEG", 10, 10, 30, 15);

    doc.setFontSize(14);
    doc.setTextColor("#f44336");
    doc.text("Booking Invoice", 90, 25);

    doc.setFontSize(10);
    doc.setTextColor("#000000");

    doc.text("From: Samyotech Solutions", 10, 40);

    doc.text(
      `To: ${bookingDetails?.booking?.[0]?.customer?.[0]?.name || ""}`,
      100,
      40
    );

    doc.autoTable({
      startY: 50,
      headStyles: { fillColor: [244, 67, 54], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      margin: { top: 20, left: 10, right: 10 },
      tableWidth: "auto",
      head: [["Field", "Details"]],
      body: [
        ["Booking Id", bookingDetails?.booking?.[0]?.bookingId || ""],
        ["Name", bookingDetails?.booking?.[0]?.customer?.[0]?.name || ""],
        ["Email", bookingDetails?.booking?.[0]?.customer?.[0]?.email || ""],
        [
          "Your Vehicle",
          bookingDetails?.booking?.[0]?.vehicleType?.[0]?.vehicleName || "",
        ],
        ["Booking Slot", finalDate || ""],
        [
          "Amount",
          `₹ ${bookingDetails?.booking?.[0]?.packages?.[0]?.price}` || "",
        ],
      ],
    });

    doc.setTextColor("#000000");
    doc.setFontSize(8);
    doc.text(
      "© Vehicle Wash Management System. All rights reserved.",
      14,
      doc.internal.pageSize.height - 10
    );

    doc.save("invoice.pdf");
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f44336",
          color: "#fff",
        }}
      >
        <img src={logo} alt="Logo" style={{ width: "8%" }} />
        <Typography variant="h6">Booking Invoice</Typography>
        <ClearIcon
          onClick={handleClose}
          style={{ cursor: "pointer", color: "#fff" }}
        />
      </DialogTitle>
      <DialogContent style={{ paddingTop: "20px" }}>
        <Card
          variant="outlined"
          style={{ border: "2px solid #f44336", borderRadius: "8px" }}
        >
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: "bold",
                    color: "#f44336",
                    textAlign: "left",
                  }}
                >
                  <strong>From: Samyotech Solutions</strong>
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="subtitle1"
                  style={{
                    fontWeight: "bold",
                    color: "#f44336",
                    textAlign: "right",
                  }}
                >
                  <strong>
                    To:{" "}
                    {bookingDetails?.booking?.[0]?.customer?.[0]?.name || ""}
                  </strong>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  style={{ fontWeight: "bold", color: "#f44336" }}
                >
                  <strong>
                    Booking Id: {bookingDetails?.booking?.[0]?.bookingId || ""}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  <strong>
                    Name:{" "}
                    {bookingDetails?.booking?.[0]?.customer?.[0]?.name || ""}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  <strong>
                    Email:{" "}
                    {bookingDetails?.booking?.[0]?.customer?.[0]?.email || ""}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  <strong>
                    Your Vehicle:{" "}
                    {bookingDetails?.booking?.[0]?.vehicleType?.[0]
                      ?.vehicleName || ""}
                  </strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  <strong>Booking Slot : {finalDate || ""}</strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ fontWeight: "bold" }}>
                  <strong>
                    Amount:{" "}
                    {`₹ ${bookingDetails?.booking?.[0]?.packages?.[0]?.price}` ||
                      ""}
                  </strong>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={downloadInvoice}>
          Download Invoice
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={handleClose}
          style={{ backgroundColor: "#f44336", color: "#fff" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Invoice;
