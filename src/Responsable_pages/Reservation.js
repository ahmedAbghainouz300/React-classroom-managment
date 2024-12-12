import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import Divider from "@mui/material/Divider";

export default function Reservation() {
  const [reservationData, setReservationData] = useState([]);

  const columns = [
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
        return params
          ? params.replace("T", " ").replace("Z", "").replace("[UTC]", "")
          : "";
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
      field: "liberation_date",
      headerName: "Date de Liberation",
      width: 220,
      valueGetter: (value, row) => {
        return row.etat_reservation === "liberee"
          ? row.liberation_date || ""
          : "-";
      },
    },
    {
      field: "delete",
      headerName: "delete",
      width: 120,
      renderCell: (params) => {
        console.log("Params Row:", JSON.stringify(params.row, null, 2));
        const isDisabled = params.row.etat_reservation === "active";
        return (
          <Button
            variant="contained"
            color="secondary"
            disabled={isDisabled}
            onClick={() => handleDelete(params.row.id)}
          >
            DELETE
          </Button>
        );
      },
    },
  ];

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reservation?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:8080/GestionWEB/reservation/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setReservationData((prevData) =>
            prevData.filter((item) => item.id !== id)
          );
          alert("Reservation deleted successfully.");
        } else {
          alert("Error deleting reservation.");
        }
      } catch (error) {
        console.error("Error deleting reservation:", error);
        alert("Error deleting reservation. Please try again.");
      }
    }
  };

  const paginationModel = { page: 0, pageSize: 5 };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/reservation/get"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const reservations = await response.json();

        const updatedReservations = await Promise.all(
          reservations.map(async (res) => {
            if (res.etat_reservation === "liberee") {
              try {
                const response1 = await fetch(
                  `http://localhost:8080/GestionWEB/reservation/getliberation/${res.id}`
                );

                const text1 = await response1.text();
                console.log(
                  `Raw Liberation Response for Reservation ID ${res.id}:`,
                  text1
                );

                if (!response1.ok) {
                  throw new Error(`HTTP error! Status: ${response1.status}`);
                }

                if (!text1) {
                  throw new Error(
                    `Empty response for liberation data for Reservation ID ${res.id}`
                  );
                }

                const liberation = JSON.parse(text1);
                return {
                  ...res,
                  liberation_date: liberation.date,
                };
              } catch (error) {
                console.error(
                  `Error fetching liberation data for Reservation ID ${res.id}:`,
                  error
                );
                return {
                  ...res,
                  liberation_date: "Error fetching liberation date",
                };
              }
            } else {
              return {
                ...res,
                liberation_date: "-",
              };
            }
          })
        );

        setReservationData(updatedReservations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <Divider style={{ margin: "20px" }} />

      <Paper>
        <DataGrid
          rows={reservationData}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{
            border: 0,
            "& .MuiDataGrid-column": {
              backgroundColor: "black",
              color: "Black",
              textDecoration: "BOLD", // Text color of the header
            },
            "& .MuiDataGrid-cell": {
              color: "#4F4F4F", // Text color for cells
            },
          }}
        />
      </Paper>
    </div>
  );
}
