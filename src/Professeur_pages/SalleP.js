import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import {
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";

export default function SalleP() {
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
      field: "demander",
      headerName: "Demander",
      width: 120,
      renderCell: (params) => {
        // Get the logged-in professor's ID from sessionStorage
        const profId = JSON.parse(sessionStorage.getItem("Professeur"))?.id;

        // Disable the button if the professeur's ID matches the logged-in professor's ID
        const isDisabledDemander = profId === params.row.professeur.id;

        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDemander(params.row)}
            disabled={isDisabledDemander} // Disable the button if IDs match
          >
            Demander
          </Button>
        );
      },
    },
    {
      field: "liberer",
      headerName: "liberer",
      width: 120,
      renderCell: (params) => {
        // Get the logged-in professor's ID from sessionStorage
        const profId = JSON.parse(sessionStorage.getItem("Professeur"))?.id;

        // Disable the button if the professeur's ID does not match the logged-in professor's ID
        const isDisabledLiberer = profId !== params.row.professeur.id;

        return (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleLiberer(params.row)}
            disabled={isDisabledLiberer} // Disable the button if IDs don't match
          >
            LIBERER
          </Button>
        );
      },
    },
  ];

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "libelle", headerName: "LIBELLE", width: 200 },
    { field: "capacite", headerName: "CAPACITE", type: "number", width: 100 },
    { field: "localisation", headerName: "LOCALISATION", width: 100 },
    { field: "type", headerName: "TYPE", width: 100 },
    {
      field: "view",
      headerName: "View",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="info"
          onClick={() => handleView(params.row)}
        >
          Vos Reservations
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
  const handleDemander = async (row) => {
    setOpenDemanderDialog(true);
    editSalle(row.libelle);
    setFormDataD({
      crenaux: {
        crenaux: "",
        id: 0,
      },
      date: "",
      etat_reservation: "",
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
      salle: {
        capacite: 0,
        id: 0,
        libelle: "",
        localisation: "",
        type: "",
      },
    });
  };
  const [salle, editSalle] = useState("");

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
  const [formDataD, setFormDataD] = useState({
    crenaux: {
      crenaux: "",
      id: 0,
    },
    date: "",
    etat_reservation: "",
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
    id: 0,
    professeur: {
      email: "",
      id: 0,
      nom: "",
      password: "",
      prenom: "",
      telephone: 0,
    },
    salle: {
      capacite: 0,
      id: 0,
      libelle: "",
      localisation: "",
      type: "",
    },
  });
  const [salleData, setSalleData] = useState([]);
  const [filiereData, setFiliereData] = useState([]);
  const [crenauxData, setCrenauxData] = useState([]);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openReserverDialog, setOpenReserverDialog] = useState(false);
  const [openDemanderDialog, setOpenDemanderDialog] = useState(false);
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
        const response4 = await fetch(
          "http://localhost:8080/GestionWEB/crenaux/get"
        );
        const data1 = await response1.json();
        setSalleData(data1);
        const data2 = await response2.json();
        setFiliereData(data2);
        const data4 = await response4.json();
        setCrenauxData(data4);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCloseDemanderDialog = () => {
    setOpenDemanderDialog(false);
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
      const { filiere, crenaux } = formDataR;

      console.log(formDataR.id, filiere, crenaux);
      const prof = JSON.parse(sessionStorage.getItem("Professeur"));
      if (!filiere || !crenaux) {
        alert("Please fill all required fields");
        return;
      }
      const response = await fetch(
        `http://localhost:8080/GestionWEB/reservation/add/${crenaux}/${prof.id}/${formDataR.id}/${filiere.id}`,
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
  const handleSubmitD = async () => {
    try {
      const { filiere } = formDataD;

      // Parse the 'Professeur' object from sessionStorage
      const prof = JSON.parse(sessionStorage.getItem("Professeur"));

      if (!prof || !prof.id) {
        alert("Professeur information is missing.");
        return;
      }

      const prof_id = prof.id; // Now, this should be the correct ID.

      console.log(formDataD.id, filiere, prof);

      if (!filiere || !prof) {
        alert("Please fill all required fields");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/GestionWEB/demande/add/${prof_id}/${formDataD.id}/${filiere.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Parse the response as JSON
      const data = await response.json();

      alert(data.message);
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

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleCloseReserverDialog = () => {
    setOpenReserverDialog(false);
  };
  return (
    <div className="container">
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
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDemanderDialog} onClose={handleCloseDemanderDialog}>
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          {`Demander la reservation de ${salle}`}
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
              value={formDataD.filiere.id || ""}
              onChange={(e) => {
                const selectedFiliere = filiereData.find(
                  (filiere) => filiere.id === e.target.value
                );
                setFormDataD({
                  ...formDataD,
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDemanderDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmitD} color="primary">
            Submit
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
