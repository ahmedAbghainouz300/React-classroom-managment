import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";
import Divider from "@mui/material/Divider";

export default function Salle() {
  const [loading, setLoading] = useState(true);
  const paginationModel = { page: 0, pageSize: 5 };
  const columns_reservations = [
    {
      field: "crenaux",
      headerName: "Crenaux",
      width: 200,
      valueGetter: (value, row) => `${row.crenaux.crenaux || ""}`,
    },
    {
      field: "etat_reservation",
      headerName: "Etat de Reservation",
      width: 120,
    },
    {
      field: "date",
      headerName: "DATE reservation",
      width: 220,
      valueFormatter: (params) => {
        return params.replace("T", " ").replace("Z", "").replace("[UTC]", "");
      },
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
          onClick={() => handleLiberer(params.row)}
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
    {
      field: "reserver",
      headerName: "Reserver",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="info"
          onClick={() => handleReserver(params.row)}
        >
          Reserver
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
  const [formDataR, setFormDataR] = useState({
    crenaux: {
      crenaux: "",
      id: 1,
    },
    date: "",
    etat_reservation: "active",
    filiere: {
      coordinateur: {
        email: "",
        id: 0,
        nom: "",
        password: "",
        prenom: "",
        telephone: 0,
      },
      effectif: 0,
      id: 0,
      libelle: "",
      matieres: [],
    },
    id: 0,
    professeur: {
      email: "",
      id: 0,
      nom: "",
      password: "",
      prenom: "",
      telephone: 0,
    },
  });
  const [salleData, setSalleData] = useState([]);
  const [filiereData, setFiliereData] = useState([]);
  const [professeurData, setProfesseurData] = useState([]);
  const [crenauxData, setCrenauxData] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openReserverDialog, setOpenReserverDialog] = useState(false);
  const [activeReservations, setActiveReservations] = useState([]);
  const [reservationData, setReservationData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch(
          "http://localhost:8080/GestionWEB/salle/get"
        );
        const response2 = await fetch(
          "http://localhost:8080/GestionWEB/filiere/get"
        );
        const response3 = await fetch(
          "http://localhost:8080/GestionWEB/professeur/get"
        );
        const response4 = await fetch(
          "http://localhost:8080/GestionWEB/crenaux/get"
        );
        const data1 = await response1.json();
        setSalleData(data1);
        console.log(salleData);
        const data2 = await response2.json();
        setFiliereData(data2);
        const data3 = await response3.json();
        setProfesseurData(data3);
        const data4 = await response4.json();
        setCrenauxData(data4);
        setLoading(false);
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

    try {
      const response = await fetch(
        `http://localhost:8080/GestionWEB/salle/getreservations/${row.id}`
      );

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
        return;
      }

      const text = await response.text(); // Read raw response
      console.log("Raw Response:", text); // Log raw text
      const data = text ? JSON.parse(text) : []; // Parse JSON if available

      setReservationData(data);
      setActiveReservations(
        data.filter((reservation) => reservation.etat_reservation === "active")
      );
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleReserver = async (row) => {
    setOpenReserverDialog(true);
    editSalle(row.libelle);
    setFormDataR({
      crenaux: {
        crenaux: "",
        id: 0,
      },
      demandes_reservation: [],
      etat_reservation: "active",
      filiere: {
        coordinateur: {
          email: "",
          id: 0,
          nom: "",
          password: "",
          prenom: "",
          telephone: 0,
        },
        effectif: 0,
        id: 0,
        libelle: "",
      },
      id: row.id,
      professeur: {
        email: "",
        id: 0,
        nom: "",
        password: "",
        prenom: "",
        telephone: 0,
      },
    });
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

  const handleSubmitR = async () => {
    try {
      const { filiere, professeur, crenaux } = formDataR;
      console.log(formDataR.id, filiere, professeur, crenaux);
      if (!filiere || !professeur || !crenaux) {
        alert("Please fill all required fields");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/GestionWEB/reservation/add/${crenaux}/${professeur.id}/${formDataR.id}/${filiere.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Parse the response as JSON
      const data = await response.json();

      // Handle the response based on the result code
      if (data.result === 1) {
        alert("Reservation created successfully.");
      } else if (data.result === 2) {
        alert("La salle est reservee.");
      } else if (data.result === 3) {
        alert("An error occurred while creating the reservation.");
      } else {
        alert("Unexpected response.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting reservation.");
    }
  };

  const handleLiberer = async (row) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to free this reservation?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/GestionWEB/liberationd/add/${row.id}`,
          {
            method: "PUT",
          }
        );
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error("Error adding liberation:", error);
        alert("Error deleting liberation. Please try again.");
      }
    }
  };

  // Function to close the view dialog
  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleCloseReserverDialog = () => {
    setOpenReserverDialog(false);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading...
        </Typography>
      </Box>
    );
  }
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
      <Divider style={{ margin: "20px" }} />

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

      <Dialog open={openReserverDialog} onClose={handleCloseReserverDialog}>
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          {`Reserver ${salle}`}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems: "center",
            height: "300px",
            width: "500px",
            "& > :not(style)": { m: 1 },
          }}
        >
          <Box component="form" noValidate autoComplete="off"></Box>
          <FormControl
            sx={{
              width: "400px",
            }}
          >
            <InputLabel>Filiere</InputLabel>
            <Select
              name="filiere"
              value={formDataR.filiere.id || ""}
              onChange={(e) => {
                const selectedFiliere = filiereData.find(
                  (filiere) => filiere.id === e.target.value
                );
                setFormDataR({
                  ...formDataR,
                  filiere: selectedFiliere,
                });
              }}
              label="Filiere"
            >
              {filiereData.map((filiere) => (
                <MenuItem key={filiere.id} value={filiere.id}>
                  {filiere.libelle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              width: "400px",
            }}
          >
            <InputLabel>Professeur</InputLabel>
            <Select
              name="professeur"
              value={formDataR.professeur.id || ""}
              onChange={(e) => {
                const selectedProfesseur = professeurData.find(
                  (prof) => prof.id === e.target.value
                );
                setFormDataR({
                  ...formDataR,
                  professeur: selectedProfesseur,
                });
              }}
              label="Filiere"
            >
              {professeurData.map((prof) => (
                <MenuItem key={prof.id} value={prof.id}>
                  {prof.nom + " " + prof.prenom}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              width: "400px",
            }}
          >
            <InputLabel>Crenaux</InputLabel>
            <Select
              name="crenaux"
              value={formDataR.crenaux || ""}
              onChange={(e) => {
                setFormDataR({ ...formDataR, crenaux: e.target.value });
              }}
              label="Crenaux"
            >
              {crenauxData.map((crenaux) => (
                <MenuItem key={crenaux.id} value={crenaux.id}>
                  {crenaux.crenaux}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReserverDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmitR} color="primary">
            {editMode ? "Save" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ height: 400, width: "100%" }}>
        <Box p={2}>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{
              backgroundColor: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            Salles
          </Typography>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <DataGrid
              rows={salleData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 15]}
            />
          </Paper>
        </Box>
      </div>
    </div>
  );
}
