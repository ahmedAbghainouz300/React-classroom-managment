import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Divider from "@mui/material/Divider";

export default function Matiere() {
  const paginationModel = { page: 0, pageSize: 5 };
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "libelle", headerName: "LIBELLE", width: 200 },
    {
      field: "horaire",
      headerName: "CHARGE HORAIRE",
      type: "number",
      width: 100,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(params.row)} // Correctly using handleEdit function
        >
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleDelete(params.row.id)} // Correctly using handleDelete function
        >
          Delete
        </Button>
      ),
    },
  ];
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    libelle: "",
    id: 0,
    horaire: 0,
  });
  const [matiereData, setMatiereData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/matiere/get"
        );
        const data = await response.json();
        setMatiereData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setEditMode(false);
    setFormData({
      libelle: "",
      id: 0,
      horaire: 0,
    });
  };

  const handleEdit = (row) => {
    setOpenDialog(true);
    setEditMode(true);
    setFormData({
      ...row,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this matiere?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/GestionWEB/matiere/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setMatiereData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
          alert("Matiere deleted successfully.");
        } else {
          alert("Error deleting matiere.");
        }
      } catch (error) {
        console.error("Error deleting matiere:", error);
        alert("Error deleting matiere. Please try again.");
      }
    }
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    try {
      const { libelle, horaire } = formData;
      // const coordinateur = storedCoordinateur
      //   ? JSON.parse(storedCoordinateur)
      //   : null;
      // const CorId = coordinateur?.id;

      if (!libelle || !horaire) {
        alert("Please fill all required fields");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/GestionWEB/matiere/${
          editMode ? "update" : "add"
        }/${formData.id || ""}${libelle}/${horaire}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setMatiereData((prev) =>
          editMode
            ? prev.map((item) =>
                item.id === updatedData.id ? updatedData : item
              )
            : [...prev, updatedData]
        );
        setOpenDialog(false);
      } else {
        alert("Error submitting matiere.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting matiere.");
    }
  };

  return (
    <div className="container">
      <Divider style={{ margin: "20px" }} />
      <div
        className="add-form"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          onClick={handleOpenDialog}
          sx={{ backgroundColor: "#D4A017" }}
        >
          Nouvelle Matiere
        </Button>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          {editMode ? "Edit Matiere" : "Ajouter Matiere"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              "& > :not(style)": { m: 1 },
            }}
            noValidate
            autoComplete="off"
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="libelle">Libelle</InputLabel>
              <OutlinedInput
                id="libelle"
                name="libelle"
                label="Libelle"
                value={formData.libelle}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="horaire">Horaire</InputLabel>
              <OutlinedInput
                id="horaire"
                name="horaire"
                type="number"
                label="Horaire"
                value={formData.horaire}
                onChange={handleInputChange}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editMode ? "Save" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Divider style={{ margin: "20px" }} />

      <Paper sx={{ width: "100%" }}>
        <DataGrid
          rows={matiereData}
          columns={columns}
          getRowId={(row) => row.id}
          pageSize={paginationModel.pageSize}
          rowsPerPageOptions={[5]}
          pagination
        />
      </Paper>
    </div>
  );
}
