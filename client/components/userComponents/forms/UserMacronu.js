import { useState, useEffect, useRef } from "react";

export default function Macronu({ closeToggle }) {
  const [glucidesP, setGlucidesP] = useState("");
  const [proteinesP, setProteinesP] = useState("");
  const [lipidesP, setLipidesP] = useState("");
  const [glucidesFocused, setGlucidesFocused] = useState(false);
  const [proteinesFocused, setProteinesFocused] = useState(false);
  const [lipidesFocused, setLipidesFocused] = useState(false);
  const [bee, setBee] = useState("");
  const [macronuId, setMacronuId] = useState("");

  const getMetabolResponse = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    try {
      const response = await fetch(`/api/user/metabol/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const metabolResponse = await response.json();
        // La réponse MetabolResponse est maintenant disponible
        return metabolResponse;
      }
    } catch (error) {
      // Gestion des erreurs
      console.error(
        "Erreur lors de la récupération des données de métabolisme :",
        error
      );
      throw error;
    }
  };

  const getMacronuResponse = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;
    try {
      // Faites une requête GET pour récupérer la réponse MetabolResponse
      const response = await fetch(`/api/user/macronu/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const macronuResponse = await response.json();
        // La réponse MetabolResponse est maintenant disponible
        return macronuResponse;
      }
    } catch (error) {
      // Gestion des erreurs
      console.error(
        "Erreur lors de la récupération des données de métabolisme :",
        error
      );
      throw error;
    }
  };

  useEffect(() => {
    getMacronuResponse().then((res) => {
      if (res) {
        if (res.id !== undefined) {
          setMacronuId(res.id);
        }
        if (res.glcP !== undefined) {
          setGlucidesP(res.glcP);
        }
        if (res.lipP !== undefined) {
          setLipidesP(res.lipP);
        }
        if (res.proP !== undefined) {
          setProteinesP(res.proP);
        }
      }
    });
  }, []);

  useEffect(() => {
    getMetabolResponse().then((res) => {
      if (res && res.bee !== undefined) {
        setBee(res.bee);
      }
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;
    // Calcul des quantités en grammes

    const glucidesG = (((glucidesP / 100) * bee) / 4).toFixed(0);
    const proteinesG = (((proteinesP / 100) * bee) / 4).toFixed(0);
    const lipidesG = (((lipidesP / 100) * bee) / 9).toFixed(0);

    const MacronuData = {
      ID: userId,
      GLCP: glucidesP,
      GLCG: glucidesG,
      LIPP: lipidesP,
      LIPG: lipidesG,
      PROP: proteinesP,
      PROG: proteinesG,
    };

    // Vérification que les pourcentages totalisent bien 100%
    const totalPourcentage =
      parseFloat(glucidesP) + parseFloat(proteinesP) + parseFloat(lipidesP);
    if (totalPourcentage !== 100) {
      alert("Les pourcentages doivent totaliser 100%");
      return;
    }
    try {
      // Envoi des données pour le métabolisme
      const macronuResponse = await fetch("/api/user/macronu/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(MacronuData),
      });
      if (macronuResponse.ok) {
        closeToggle();
      }
    } catch (error) {
      // Gestion des erreurs
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    // Calcul des quantités en grammes
    const glucidesG = (((glucidesP / 100) * bee) / 4).toFixed(0);
    const proteinesG = (((proteinesP / 100) * bee) / 4).toFixed(0);
    const lipidesG = (((lipidesP / 100) * bee) / 9).toFixed(0);
    const updateMacronuData = {
      id: macronuId,
      ID: userId,
      GLCP: glucidesP,
      GLCG: glucidesG,
      LIPP: lipidesP,
      LIPG: lipidesG,
      PROP: proteinesP,
      PROG: proteinesG,
    };
    try {
      // Envoi des données pour le métabolisme
      const macronuResponse = await fetch(`/api/user/macronu/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateMacronuData),
      });
      if (macronuResponse.ok) {
        closeToggle();
      }
    } catch (error) {
      // Gestion des erreurs
      console.error("Erreur lors de la mise à jour des données :", error);
      // Afficher un message d'erreur à l'utilisateur si nécessaire
    }
  };

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <form>
          <h1 onChange={setBee}> Besoins Énergétiques : {bee} kcal/jour</h1>
          <h3>Recommandations glucides </h3>
          {glucidesFocused && (
          <div className="flex justify-center">
            
            <ul>
              <li>45 à 65% de l’apport énergétique</li>
              <li>Minimum de 80-100g pour les fonctions neurologiques</li>
            </ul>
          </div>
        )}

        {proteinesFocused && (
          <div>
            <h3>Recommandations protéines </h3>
            <ul>
              <li>10 à 35% de l’apport énergétique</li>
              <li>0,8 g/kg poids corporel</li>
            </ul>
          </div>
        )}

        {lipidesFocused && (
          <div>
            <h3>Recommandations lipides</h3>
            <ul>
              <li>20 à 35% de l’apport énergétique</li>
              <li>Acide gras saturés Maximum 10%</li>
             
            </ul>
          </div>
        )}

          <div className="div-calorique">
            <label>Glucides % : </label>
            <input
              className="input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="200"
              value={glucidesP}
              onChange={(e) => setGlucidesP(e.target.value)}
              onFocus={() => setGlucidesFocused(true)}
              onBlur={() => setGlucidesFocused(false)}
            />
          </div>
          <div className="div-calorique">
            <label>Protéines % : </label>
            <input
              className="input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="200"
              value={proteinesP}
              onChange={(e) => setProteinesP(e.target.value)}
              onFocus={() => setProteinesFocused(true)}
              onBlur={() => setProteinesFocused(false)}
            />
          </div>
          <div className="div-calorique">
            <label>Lipides % : </label>
            <input
              className="input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="200"
              value={lipidesP}
              onChange={(e) => setLipidesP(e.target.value)}
              onFocus={() => setLipidesFocused(true)}
              onBlur={() => setLipidesFocused(false)}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex justify-center">
              <button className="input" type="submit" onClick={handleSave}>
                Enregistrer
              </button>
            </div>
            <div className="flex justify-center ">
              <button className="input text-sm" onClick={handleUpdate}>
                Modifer
              </button>
            </div>
          </div>
        </form>

        
        <div>
          <div className="info-item">
            <h3>Glucides en grammes :</h3>
            <div>
              {(((parseFloat(glucidesP) / 100) * bee) / 4).toFixed(1)} g
            </div>
          </div>
          <div className="info-item">
            <h3>Protéines en grammes :</h3>
            <div>
              {(((parseFloat(proteinesP) / 100) * bee) / 4).toFixed(1)} g
            </div>
          </div>
          <div className="info-item">
            <h3>Lipides en grammes :</h3>
            <div>{(((parseFloat(lipidesP) / 100) * bee) / 9).toFixed(1)} g</div>
          </div>
        </div>
      </div>
    </>
  );
}
