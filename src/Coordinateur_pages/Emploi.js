import * as React from "react";
import { Card, Divider } from "@mui/material"; // Import Card component
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";

export default function Emploi() {
  const [showPdf, setShowPdf] = useState(false); // To control PDF display
  const [pdfPath, setPdfPath] = useState(
    "C:/Users/HP/Downloads/CV_2024-11-21_AHMED_ABGHAINOUZ.pdf"
  ); // Local path to PDF

  const handleLearnMore = () => {
    setShowPdf(true);
  };

  const handleDownload = () => {
    // Trigger download action
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = pdfPath.split("/").pop(); // Set the filename to the last part of the URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Divider style={{ margin: "20px" }} />
      <div
        className="add-form"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button variant="contained" sx={{ backgroundColor: "#D4A017" }}>
          Nouvelle Filière
        </Button>
      </div>
      <Divider style={{ margin: "20px" }} />
      <Card sx={{ maxWidth: 345 }}>
        <CardMedia
          component="img"
          alt="Emploi image"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Example Emploi
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Example description of the Emploi. This is a placeholder text.
          </Typography>
        </CardContent>
        <CardActions>
          {showPdf ? (
            <Button size="small" onClick={handleDownload}>
              Download PDF
            </Button>
          ) : (
            <Button size="small" onClick={handleLearnMore}>
              Learn More
            </Button>
          )}
        </CardActions>
      </Card>

      {/* Display PDF */}
      {showPdf && (
        <div style={{ marginTop: "20px" }}>
          <h3>View PDF:</h3>
          <iframe
            src={pdfPath}
            width="600"
            height="400"
            style={{ border: "1px solid #ccc" }}
            title="Emploi PDF"
          />
        </div>
      )}
    </div>
  );
}
