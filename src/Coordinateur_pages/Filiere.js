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

export default function Filiere() {
  const paginationModel = { page: 0, pageSize: 5 };
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "libelle", headerName: "LIBELL", width: 200 },
    { field: "effectif", headerName: "EFFECTIF", type: "number", width: 100 },
    {
      field: "Cordinateur",
      headerName: "Coordinateur Name",
      width: 250,
      valueGetter: (value, row) =>
        `${row.coordinateur.nom || ""} ${row.coordinateur.prenom || ""}`,
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
    coordinateur: {
      email: "",
      id: 0,
      nom: "",
      prenom: "",
      telephone: 0,
    },
    effectif: "",
    id: 0,
    libelle: "",
  });
  const [filiereData, setFiliereData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/filiere/get"
        );
        const data = await response.json();
        setFiliereData(data);
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
      coordinateur: {
        email: "",
        id: 0,
        nom: "",
        prenom: "",
        telephone: 0,
      },
      effectif: "",
      id: 0,
      libelle: "",
    });
  };

  const handleEdit = (row) => {
    setOpenDialog(true);
    setEditMode(true);
    setFormData({
      ...row,
      coordinateur: row.coordinateur || {
        email: "",
        id: 0,
        nom: "",
        prenom: "",
        telephone: 0,
      },
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this filiere?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/GestionWEB/filiere/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setFiliereData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
          alert("Filiere deleted successfully.");
        } else {
          alert("Error deleting filiere.");
        }
      } catch (error) {
        console.error("Error deleting filiere:", error);
        alert("Error deleting filiere. Please try again.");
      }
    }
  };

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

  const handleSubmit = async () => {
    try {
      const { libelle, effectif } = formData;
      const storedCoordinateur = sessionStorage.getItem("Coordinateur");
      const coordinateur = storedCoordinateur
        ? JSON.parse(storedCoordinateur)
        : null;
      const CorId = coordinateur?.id;

      if (!libelle || !effectif || !CorId) {
        alert("Please fill all required fields");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/GestionWEB/filiere/${
          editMode ? "update" : "add"
        }/${editMode ? formData.id + "/" : ""}${libelle}/${effectif}/${
          editMode ? "" : CorId
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setFiliereData((prev) =>
          editMode
            ? prev.map((item) =>
                item.id === updatedData.id ? updatedData : item
              )
            : [...prev, updatedData]
        );
        setOpenDialog(false);
      } else {
        alert("Error submitting filiere.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting filiere.");
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
          Nouvelle Filière
        </Button>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          {editMode ? "Edit Filière" : "Ajouter Filière"}
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
              <InputLabel htmlFor="effectif">Effectif</InputLabel>
              <OutlinedInput
                id="effectif"
                name="effectif"
                type="number"
                label="Effectif"
                value={formData.effectif}
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
          rows={filiereData}
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
