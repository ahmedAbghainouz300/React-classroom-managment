import React, { useEffect, useState } from "react";

export default function Home() {
  // State to store counts and fetched data
  const [salleCount, setSalleCount] = useState(0);
  const [reservationCount, setReservationCount] = useState(0);
  const [activeReservationCount, setActiveReservationCount] = useState(0);

  // State to store the final values for animation
  const [finalSalleCount, setFinalSalleCount] = useState(0);
  const [finalReservationCount, setFinalReservationCount] = useState(0);
  const [finalActiveReservationCount, setFinalActiveReservationCount] =
    useState(0);

  // Fetch data from APIs when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch the salles
        const salleResponse = await fetch(
          "http://localhost:8080/GestionWEB/salle/get"
        );
        const salles = await salleResponse.json();
        setFinalSalleCount(salles.length); // Set the final salle count

        // Fetch the reservations
        const reservationResponse = await fetch(
          "http://localhost:8080/GestionWEB/reservation/get"
        );
        const reservations = await reservationResponse.json();
        setFinalReservationCount(reservations.length); // Set the final reservation count

        // Filter active reservations
        const activeReservations = reservations.filter(
          (reservation) => reservation.etat_reservation === "active"
        );
        setFinalActiveReservationCount(activeReservations.length); // Set the final active reservation count
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  // Animation for count increment
  const animateCount = (startValue, endValue, setState) => {
    let currentValue = startValue;
    const duration = 2000; // duration in milliseconds (2 seconds)
    const increment = ((endValue - startValue) / duration) * 50; // value to increment per frame

    const animate = () => {
      currentValue += increment;
      if (currentValue >= endValue) {
        currentValue = endValue;
      }
      // Update the state to trigger re-render
      setState(Math.floor(currentValue));

      if (currentValue < endValue) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  // Call animateCount when final values are set
  useEffect(() => {
    if (finalSalleCount > 0) {
      animateCount(salleCount, finalSalleCount, setSalleCount);
    }
    if (finalReservationCount > 0) {
      animateCount(
        reservationCount,
        finalReservationCount,
        setReservationCount
      );
    }
    if (finalActiveReservationCount > 0) {
      animateCount(
        activeReservationCount,
        finalActiveReservationCount,
        setActiveReservationCount
      );
    }
  }, [finalSalleCount, finalReservationCount, finalActiveReservationCount]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "20px",
      }}
    >
      <div className="card">
        <h3>Salles</h3>
        <p>{salleCount}</p>
      </div>
      <div className="card">
        <h3>Reservations</h3>
        <p>{reservationCount}</p>
      </div>
      <div className="card">
        <h3>Active Reservations</h3>
        <p>{activeReservationCount}</p>
      </div>
    </div>
  );
}
