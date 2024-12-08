import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [coordinateurs, setCoordinateurs] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [responsables, setResponsables] = useState([]);

  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {
    const fetchCoordinateurs = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/coordinateur/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setCoordinateurs(data);
      } catch (err) {
        console.error(err.message);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchCoordinateurs();
  }, []);

  useEffect(() => {
    const fetchProfesseurs = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/professeur/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setProfesseurs(data);
      } catch (err) {
        console.error(err.message);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchProfesseurs();
  }, []);

  useEffect(() => {
    const fetchResponsables = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/GestionWEB/responsable/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setResponsables(data);
      } catch (err) {
        console.error(err.message);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchResponsables();
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password || !role) {
      setError("Please fill all fields.");
      return;
    }
    if (role === "Coordinateur") {
      const user = coordinateurs.find(
        (coord) => coord.email === username && coord.password === password
      );

      if (user) {
        sessionStorage.setItem("Coordinateur", JSON.stringify(user));
        navigate("/CoordinateurLayout");
      } else {
        setError("Invalid username, password, or role.");
      }
    } else if (role === "Professeur") {
      const user = professeurs.find(
        (prof) => prof.email === username && prof.password === password
      );

      if (user) {
        sessionStorage.setItem("Professeur", JSON.stringify(user));
        console.log(sessionStorage.getItem("Professeur"));
        navigate("/ProfesseurLayout");
      } else {
        setError("Invalid username, password, or role.");
      }
    } else {
      const user = responsables.find(
        (respo) => respo.email === username && respo.password === password
      );

      if (user) {
        sessionStorage.setItem("Responsable", JSON.stringify(user));
        navigate("/ResponsableLayout");
      } else {
        setError("Invalid username, password, or role.");
      }
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            maxWidth: 400,
            margin: "auto",
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Login</h2>

          {/* Username Input */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* Password Input */}
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Role Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              label="Role"
              required
            >
              <MenuItem value="Coordinateur">Coordinateur</MenuItem>
              <MenuItem value="Responsable">Responsable</MenuItem>
              <MenuItem value="Professeur">Professeur</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{
              marginTop: 20,
              backgroundColor: "#D4A017",
              color: "black",
            }}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
