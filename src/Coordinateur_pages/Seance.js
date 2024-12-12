import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

export default function Seance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/seance/get"
        );
        const result = await response.json();
        const transformedRows = result.map((row) => ({
          ...row,
          id: row.id, // Ensure every row has a unique ID
        }));
        setData(result);
        setRows(transformedRows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSupprimer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this seance?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/GestionWEB/seance/delete/${id}`,
          {
            method: "DELETE",
          }
        );
        alert("seance supprimee");
      } catch (error) {
        console.error("Error deleting liberation:", error);
        alert("Error deleting liberation. Please try again.");
      }
    }
  };
  const columns = [
    {
      field: "crenaux",
      headerName: "Crenaux",
      width: 200,
      valueGetter: (value, row) => `${row.crenaux.crenaux || ""}`,
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
      valueGetter: (value, row) => `${row.matiere.filiere.libelle || ""}`,
    },
    {
      field: "filiere",
      headerName: "Filiere",
      width: 120,
      valueGetter: (value, row) => `${row.matiere.libelle || ""}`,
    },
    {
      field: "supprimer",
      headerName: "supprimer",
      width: 120,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSupprimer(params.row.id)}
        >
          Supprimer
        </Button>
      ),
    },
  ];

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
        Seances
      </Typography>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 15]}
        />
      </Paper>
    </Box>
  );
}
