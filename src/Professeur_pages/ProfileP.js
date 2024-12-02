import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
export default function ProfileP() {
  // State to hold the profile data
  const [professeur, setProfesseur] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
  });

  // State to manage dialog visibility
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch profile data from session or API when the component mounts
  useEffect(() => {
    const userProfesseur = sessionStorage.getItem("Professeur");
    console.log("Retrieved Coordinateur from sessionStorage:", userProfesseur); // Log the retrieved data
    if (userProfesseur) {
      setProfesseur(JSON.parse(userProfesseur)); // Assuming the sessionStorage holds a JSON string
    } else {
      // If no data found in sessionStorage, you can set default values or show a message
      console.log("No Professeur found in sessionStorage.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfesseur((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Open the edit profile dialog
  const handleEdit = () => {
    setDialogOpen(true);
  };

  // Close the edit profile dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Handle saving the updated profile
  const handleSave = () => {
    const { email, id, nom, prenom, telephone, password } = professeur;

    fetch(
      `http://localhost:8080/GestionWEB/professeur/update/${id}/${nom}/${prenom}/${email}/${password}/${telephone}`,
      {
        method: "PUT",
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.text().then((text) => {
            return text ? JSON.parse(text) : null;
          });
        } else {
          throw new Error("Failed to update profile");
        }
      })
      .then((data) => {
        if (data) {
          console.log("Profile updated successfully:", data);
        } else {
          console.log("Profile updated, but no additional data returned.");
        }
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      })
      .finally(() => {
        setDialogOpen(false);
      });
  };

  // Handle deleting the user by their ID
  const handleDelete = () => {
    const { id } = professeur;
    // Confirm before deleting
    const confirmation = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmation) {
      fetch(`http://localhost:8080/GestionWEB/professeur/delete/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Account deleted successfully.");
            // You can also handle redirection or clearing session storage here
            sessionStorage.removeItem("Professeur"); // Clear session storage
            window.location.href = "/"; // Redirect to login page or home page
          } else {
            throw new Error("Failed to delete account");
          }
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }
  };

  return (
    <div>
      <h2>Profile Information</h2>
      <ul>
        <li>
          <strong>Nom:</strong> {professeur.nom}
        </li>
        <li>
          <strong>Prenom:</strong> {professeur.prenom}
        </li>
        <li>
          <strong>Email:</strong> {professeur.email}
        </li>
        <li>
          <strong>Telephone:</strong> {professeur.telephone}
        </li>
        <li>
          <strong>Mot de passe:</strong> {professeur.password}
        </li>
      </ul>
      <Button
        variant="contained"
        style={{ backgroundColor: "#D4A017", marginRight: "10px" }}
        onClick={handleEdit}
      >
        Edit Profile
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleDelete} // Call handleDelete on delete button click
      >
        Delete Account
      </Button>

      {/* Edit Profile Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Nom"
            name="nom"
            value={professeur.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prenom"
            name="prenom"
            value={professeur.prenom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={professeur.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Telephone"
            name="telephone"
            value={professeur.telephone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            value={professeur.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="primary"
            style={{ backgroundColor: "#D4A017" }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
