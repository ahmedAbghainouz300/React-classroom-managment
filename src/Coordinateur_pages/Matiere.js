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
  Select,
  MenuItem,
} from "@mui/material";
import Divider from "@mui/material/Divider";

export default function Matiere() {
  const paginationModel = { page: 0, pageSize: 5 };
  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "libelle", headerName: "LIBELLE", width: 200 },
    {
      field: "horaire_cours",
      headerName: "CHARGE HORAIRE COURS",
      type: "number",
      width: 100,
    },
    {
      field: "horaire_tp",
      headerName: "CHARGE HORAIRE TP",
      type: "number",
      width: 100,
    },
    {
      field: "horaire_td",
      headerName: "CHARGE HORAIRE TD",
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
          onClick={() => handleEdit(params.row)}
        >
          Edit
        </Button>
      ),
    },
    {
      field: "Filiere",
      headerName: "Filiere",
      width: 250,
      valueGetter: (value, row) => `${row.filiere.libelle || ""}`,
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
  ];

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

  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    libelle: "",
    id: 0,
    horaire_cours: 0,
    horaire_tp: 0,
    horaire_td: 0,
    filiere: {
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
    },
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
      horaire_cours: 0,
      horaire_tp: 0,
      horaire_td: 0,
      filiere: {
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
      },
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
      const { libelle, horaire_cours, horaire_tp, horaire_td, filiere } =
        formData;
      const filiere_id = filiere ? filiere.id : null;

      if (!filiere_id) {
        alert("Please select a Filiere.");
        return;
      }
      if (
        !libelle ||
        !horaire_cours ||
        !filiere ||
        !horaire_tp ||
        !horaire_td
      ) {
        alert("Please fill all required fields");
        return;
      }

      const newMatiere = {
        id: editMode ? formData.id : Date.now(),
        libelle,
        horaire_cours,
        horaire_tp,
        horaire_td,
        filiere,
      };

      setMatiereData((prev) =>
        editMode
          ? prev.map((item) =>
              item.id === formData.id
                ? {
                    ...item,
                    libelle,
                    horaire_cours,
                    horaire_tp,
                    horaire_td,
                    filiere,
                  }
                : item
            )
          : [...prev, newMatiere]
      );

      const response = await fetch(
        `http://localhost:8080/GestionWEB/matiere/${
          editMode ? "update" : "add"
        }/${
          editMode ? formData.id + "/" : ""
        }${libelle}/${horaire_cours}/${horaire_tp}/${horaire_td}/${filiere_id}`,
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
            : prev
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
      <Divider style={{ margin: "20px" }} />

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
              <InputLabel htmlFor="horaire_cours">Horaire cours</InputLabel>
              <OutlinedInput
                id="horaire_cours"
                name="horaire_cours"
                type="number"
                label="Horaire"
                value={formData.horaire_cours}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="horaire_tp">Horaire TP</InputLabel>
              <OutlinedInput
                id="horaire_tp"
                name="horaire_tp"
                type="number"
                label="Horaire"
                value={formData.horaire_tp}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="horaire_td">Horaire TD</InputLabel>
              <OutlinedInput
                id="horaire_td"
                name="horaire_td"
                type="number"
                label="Horaire"
                value={formData.horaire_td}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Filiere</InputLabel>
              <Select
                name="filiere"
                value={formData.filiere.id || ""} // Use only the id of the selected filiere
                onChange={(e) => {
                  const selectedFiliere = filiereData.find(
                    (filiere) => filiere.id === e.target.value
                  );
                  setFormData({
                    ...formData,
                    filiere: selectedFiliere, // Store the entire filiere object here
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={matiereData}
          columns={columns}
          pageSize={paginationModel.pageSize}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Paper>
    </div>
  );
}
