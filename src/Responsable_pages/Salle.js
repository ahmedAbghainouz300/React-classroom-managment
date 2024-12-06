import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { format, parseISO } from "date-fns";

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
import { maxWidth } from "@mui/system";

export default function Salle() {
  const crenaux = [
    "Lundi : 8:30-10:30",
    "Lundi :10:30-12:30",
    "Lundi :14:30-16:30",
    "Lundi :16:30-18:30",
    "Mardi : 8:30-10:30",
    "Mardi :10:30-12:30",
    "Mardi :14:30-16:30",
    "Mardi :16:30-18:30",
    "Mercredi : 8:30-10:30",
    "Mercredi :10:30-12:30",
    "Mercredi :14:30-16:30",
    "Mercredi :16:30-18:30",
    "Jeudi : 8:30-10:30",
    "Jeudi :10:30-12:30",
    "Jeudi :14:30-16:30",
    "Jeudi :16:30-18:30",
    "Vendredi : 8:30-10:30",
    "Vendredi :10:30-12:30",
    "Vendredi :14:30-16:30",
    "Vendredi :16:30-18:30",
    "Samedi : 8:30-10:30",
    "Samedi :10:30-12:30",
    "Samedi :14:30-16:30",
    "Samedi :16:30-18:30",
  ];
  const paginationModel = { page: 0, pageSize: 5 };
  const columns_reservations = [
    { field: "crenaux", headerName: "Crenaux", width: 120 },
    {
      field: "etat_reservation",
      headerName: "Etat de Reservation",
      width: 120,
    },
    {
      field: "date",
      headerName: "DATE reservation",
      width: 120,
    },

    {
      field: "professeur",
      headerName: "Professeur",
      width: 120,
      valueGetter: (value, row) =>
        `${row.professeur.nom || ""} ${row.professeur.prenom || ""}`,
    },
    {
      field: "filiere",
      headerName: "Filiere",
      width: 120,
      valueGetter: (value, row) => `${row.filiere.libelle || ""}`,
    },
    {
      field: "liberer",
      headerName: "liberer",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleLiberer(params.row.id)}
        >
          LIBERER
        </Button>
      ),
    },
    {
      field: "view",
      headerName: "View",
      width: 80,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="info"
          onClick={() => handleView(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "libelle", headerName: "LIBELLE", width: 200 },
    { field: "capacite", headerName: "CAPACITE", type: "number", width: 100 },
    { field: "localisation", headerName: "LOCALISATION", width: 100 },
    { field: "type", headerName: "TYPE", width: 100 },
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(params.row)}
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
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
    {
      field: "view",
      headerName: "View",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="info"
          onClick={() => handleView(params.row)}
        >
          View
        </Button>
      ),
    },
  ];

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [salle, editSalle] = useState("");
  const [formData, setFormData] = useState({
    id: 0,
    capacite: 50,
    libelle: "",
    localisation: "",
    reservations: [],
    type: "",
  });
  const [salleData, setSalleData] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [activeReservations, setActiveReservations] = useState([]);
  const [reservationData, setReservationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/salle/get"
        );
        const data = await response.json();
        setSalleData(data);
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
      id: 0,
      capacite: 0,
      libelle: "",
      localisation: "",
      reservations: [],
      type: "",
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
      "Are you sure you want to delete this salle?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/GestionWEB/salle/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setSalleData((prevData) => prevData.filter((item) => item.id !== id));
          alert("Salle deleted successfully.");
        } else {
          alert("Error deleting salle.");
        }
      } catch (error) {
        console.error("Error deleting salle:", error);
        alert("Error deleting salle. Please try again.");
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const { libelle, type, localisation, capacite } = formData;

      if (!libelle || !type || !localisation || !capacite) {
        alert("Please fill all required fields");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/GestionWEB/salle/${
          editMode ? "update" : "add"
        }/${
          editMode ? formData.id + "/" : ""
        }${libelle}/${type}/${localisation}/${capacite}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedData = await response.json();
        setSalleData((prev) =>
          editMode
            ? prev.map((item) =>
                item.id === updatedData.id ? updatedData : item
              )
            : [...prev, updatedData]
        );
        setOpenDialog(false);
      } else {
        alert("Error submitting salle.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting salle.");
    }
  };

  // New function to handle the view action
  const handleView = async (row) => {
    setOpenViewDialog(true);
    editSalle(row.libelle);
    const response = await fetch(
      `http://localhost:8080/GestionWEB/salle/getreservations/${row.id}`
    );
    const data = await response.json();
    setReservationData(data);
    setActiveReservations(
      reservationData.filter(
        (reservation) => reservation.etat_reservation === "active"
      )
    );
  };

  const handleLiberer = () => {};

  // Function to close the view dialog
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
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
          Nouvelle Salle
        </Button>
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          {editMode ? "Edit Salle" : "Ajouter Salle"}
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
                onChange={(e) =>
                  setFormData({ ...formData, libelle: e.target.value })
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="type">Type</InputLabel>
              <OutlinedInput
                id="type"
                name="type"
                label="Type"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="localisation">Localisation</InputLabel>
              <OutlinedInput
                id="localisation"
                name="localisation"
                label="Localisation"
                value={formData.localisation}
                onChange={(e) =>
                  setFormData({ ...formData, localisation: e.target.value })
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="capacite">Capacite</InputLabel>
              <OutlinedInput
                id="capacite"
                name="capacite"
                label="Capacite"
                type="number"
                value={formData.capacite}
                onChange={(e) =>
                  setFormData({ ...formData, capacite: e.target.value })
                }
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

      {/* View Dialog with Reservation Data */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="lg" // Adjust the maxWidth to control the width of the dialog
        fullWidth // Allow the dialog to take up more horizontal space
      >
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
            {`Reservations de ${salle}`}
          </DialogTitle>
        </DialogTitle>
        <DialogContent style={{ height: "500px" }}>
          {/* Set a custom height for the dialog content */}
          <Box component="div" style={{ height: "100%" }}>
            <h3>Reservation Details</h3>
            <div style={{ height: "100%" }}>
              <DataGrid
                rows={activeReservations}
                columns={columns_reservations}
                pageSize={5}
                rowsPerPageOptions={[5]}
                paginationMode="server"
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={salleData}
          columns={columns}
          pageSize={paginationModel.pageSize}
          rowsPerPageOptions={[5]}
          pagination
          checkboxSelection
        />
      </div>
    </div>
  );
}
