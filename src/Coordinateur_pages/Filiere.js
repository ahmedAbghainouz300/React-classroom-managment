import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

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
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Divider from "@mui/material/Divider";

export default function Filiere() {
  const [loading, setLoading] = useState(true);
  const paginationModel = { page: 0, pageSize: 5 };
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "libelle", headerName: "LIBELLE", width: 100 },
    { field: "effectif", headerName: "EFFECTIF", type: "number", width: 100 },
    {
      field: "Cordinateur",
      headerName: "Coordinateur Name",
      width: 150,
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
          onClick={() => handleDelete(params.row.id)} // Correctly using handleDelete function
        >
          Delete
        </Button>
      ),
    },
    {
      field: "seance",
      headerName: "Seance",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSeance(params.row.id)}
        >
          Seance
        </Button>
      ),
    },
    {
      field: "emploi",
      headerName: "Emploi",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleEmploi(params.row.id)}
        >
          Emploi
        </Button>
      ),
    },
  ];
  const [openDialog, setOpenDialog] = useState(false);
  const [openSeanceDialog, setOpenSeanceDialog] = useState(false);
  const [openEmploiDialog, setOpenEmploiDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedFiliere, setSelectedFiliere] = useState(false);
  const [formSeanceData, setFormSeanceData] = useState({
    crenaux: {
      crenaux: "",
      id: 0,
    },
    id: 0,
    matiere: {
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
      horaire_cours: 0,
      horaire_td: 0,
      horaire_tp: 0,
      id: 0,
      libelle: "",
    },
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
  const [professeurData, setProfesseurData] = useState([]);
  const [matiereData, setMatiereData] = useState([]);
  const [salleData, setSalleData] = useState([]);
  const [filteredMatiere, setFilteredMatiere] = useState([]);
  const [crenauxData, setCrenauxData] = useState([]);
  const [seanceData, setSeanceData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/filiere/get"
        );
        const data = await response.json();
        setFiliereData(data);
        const response1 = await fetch(
          "http://localhost:8080/GestionWEB/matiere/get"
        );
        const data1 = await response1.json();
        setMatiereData(data1);
        const response2 = await fetch(
          "http://localhost:8080/GestionWEB/salle/get"
        );
        const data2 = await response2.json();
        setSalleData(data2);
        const response3 = await fetch(
          "http://localhost:8080/GestionWEB/professeur/get"
        );
        const data3 = await response3.json();
        setProfesseurData(data3);
        const response4 = await fetch(
          "http://localhost:8080/GestionWEB/crenaux/get"
        );
        const data4 = await response4.json();
        setCrenauxData(data4);
        const response5 = await fetch(
          "http://localhost:8080/GestionWEB/seance/get"
        );
        const data5 = await response5.json();
        setSeanceData(data5);
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
  const handleCloseSeanceDialog = () => {
    setOpenSeanceDialog(false);
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

  const handleSeance = (id) => {
    const filtered = matiereData.filter((matiere) => matiere.filiere.id === id);
    setFilteredMatiere(filtered);
    setSelectedFiliere(id);
    setOpenSeanceDialog(true);
    setFormSeanceData({
      crenaux: {
        crenaux: "",
        id: 0,
      },
      id: 0,
      matiere: {
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
        horaire_cours: 0,
        horaire_td: 0,
        horaire_tp: 0,
        id: 0,
        libelle: "",
      },
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

  const handleSubmitSeance = async () => {
    try {
      const { crenaux, professeur, matiere, salle } = formSeanceData;

      if (!crenaux || !professeur || !matiere || !salle) {
        alert("Please fill all required fields");
        return;
      }
      const response = await fetch(
        `http://localhost:8080/GestionWEB/seance/${"add"}/${selectedFiliere}/${
          crenaux.id
        }/${professeur.id}/${matiere.id}/${salle.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      alert(responseData.message);
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting filiere.");
    }
  };

  const handleCloseEmploiDialog = () => {
    setOpenEmploiDialog(false);
  };

  const handleEmploi = (id) => {
    setSelectedFiliere(id);
    setOpenEmploiDialog(true);
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

      <Dialog open={openEmploiDialog} onClose={handleCloseEmploiDialog}>
        <DialogTitle style={{ backgroundColor: "#D4A017", color: "black" }}>
          Emploi du Temps
        </DialogTitle>
        <DialogContent>
          <div>
            <TableContainer>
              <Table style={{ borderCollapse: "collapse", width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      Jour
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      8:30-10:30
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      10:30-12:30
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      14:30-16:30
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                      16:30-18:30
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    "Lundi",
                    "Mardi",
                    "Mercredi",
                    "Jeudi",
                    "Vendredi",
                    "Samedi",
                  ].map((day, dayIndex) => (
                    <TableRow key={day}>
                      <TableCell style={{ border: "1px solid #ddd" }}>
                        {day}
                      </TableCell>
                      {[1, 2, 3, 4].map((slotIndex) => {
                        const crenauxId = dayIndex * 4 + slotIndex;
                        const seance = seanceData.find(
                          (s) =>
                            s.crenaux.id === crenauxId &&
                            s.matiere.filiere.id === selectedFiliere
                        );

                        return (
                          <TableCell
                            key={crenauxId}
                            style={{ border: "1px solid #ddd" }}
                          >
                            {seance ? (
                              <div>
                                <strong>{seance.matiere.libelle}</strong>
                                <br />
                                {seance.professeur.nom}{" "}
                                {seance.professeur.prenom}
                                <br />
                                {seance.salle.libelle}
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {seanceData.length === 0 && (
              <div
                style={{ textAlign: "center", padding: "10px", color: "#888" }}
              >
                Aucun emploi du temps disponible.
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEmploiDialog} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>

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
          Filieres
        </Typography>
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
      </Box>
    </div>
  );
}
