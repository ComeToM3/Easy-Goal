//main/components/log/Signup.js

import { useState } from "react";
import { useRouter } from "next/router";
import Login from "./Login";

export default function Signup({ onClose }) {
  const router = useRouter();
  const [userNom, setNom] = useState("");
  const [userPrenom, setPrenom] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrenom, userNom, userEmail, userPassword }),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        setIsRegistered(true);
      } else {
        if (responseData && responseData.message === "Cet email est déjà utilisé") {
          setIsRegistered(true); // Affichez la composante de connexion si l'email est déjà utilisé
        } else {
          if (responseData && responseData.message) {
            console.log(responseData.message); // Affichez le message d'erreur dans la console pour déboguer
          } else {
            console.log("Erreur d'inscription"); // Message par défaut si le message d'erreur n'est pas disponible
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isRegistered ? (
        <Login /> // Affichez la composante de connexion si l'enregistrement est réussi
      ) : (
        /* Votre composante Signup actuelle */
        <div className="overlay">
          <div className="login-form">
            <div className="border-2 rounded-md">
              <div className="flex justify-center">
                <img
                  className="helmet  p-2"
                  src="/helmet.png"
                  alt="Helmet"
                ></img>
              </div>
              <form onSubmit={handleSignup}>
              <input
                  className="input-log"
                  type="text"
                  placeholder="Votre Prénom"
                  value={userPrenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
                <input
                className="input-log"
                type="text"
                placeholder="Votre Nom de Famille"
                value={userNom}
                onChange={(e) => setNom(e.target.value)}
              />
                <input
                  className="input-log"
                  type="email"
                  placeholder="Entrez Votre Courriel"
                  value={userEmail}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="input-log"
                  type="password"
                  placeholder="Entrez Votre Mot de Passe"
                  value={userPassword}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-evenly">
                  <button className="btn-log" type="submit">
                    S'inscrire
                  </button>
                  <button className="btn-log" onClick={onClose}>
                    Fermer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
