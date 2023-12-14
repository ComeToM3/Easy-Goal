// Login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login({ onClose }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;
        
        localStorage.setItem('token', token );
  
        
        router.push("/user/dashboard");

        
      } else {
        // Gestion des erreurs de connexion
      }
    } catch (error) {
      // Gestion des erreurs
    }
  };

  return (
    <>
      <div className="overlay">
        
        <div className="login-form">
        <div className="border-2 rounded-md">
            <div className="flex justify-center">
                <img className="helmet  p-2" src="/helmet.png" alt="Helmet"></img></div>
              <form onSubmit={handleLogin}>
                <input
                  className="input-log"
                  type="email"
                  placeholder="Entrez votre courriel"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="input-log"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="flex justify-evenly">
                  <button className="btn-log" type="submit">Se connecter</button>
                  <button className="btn-log" onClick={onClose}>Fermer</button>
                </div>
              </form>
        </div>
        </div>
      </div>
    </>
  );
}
