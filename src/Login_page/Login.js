import React, { useState } from "react";
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
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const navigate = new useNavigate();

  //   const handleLogin = async (e) => {
  //     e.preventDefault();
  //     // Your login logic
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation (example)
    if (!username || !password || !role) {
      setError("Please fill all fields.");
      return;
    }
    if (
      username === "Coordinateur" &&
      password === "Coordinateur" &&
      role === "Coordinateur"
    ) {
      navigate("/CoordinateurLayout");
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
            flexDirection:
              "column" /* Ensure the inputs are stacked vertically */,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Login</h2>
          {error && <p style={{ color: "#D4A017" }}>{error}</p>}

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

          {/* Submit Button */}
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
