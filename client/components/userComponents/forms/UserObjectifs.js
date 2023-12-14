import { useState, useEffect, useRef } from "react";

export default function FicheInfo({ closeToggle }) {
  const [formData, setFormData] = useState({
    ltg: "",
    action1: "",
    objectif1: "",
    toAchieve1: "",
    action2: "",
    objectif2: "",
    toAchieve2: "",
    othersWillKnow: "",
    potentialSabotage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;


    const objectifData = {
      ID: userId,
      LTG: formData.ltg,
      OBJ1: formData.objectif1,
      ACT1: formData.action1,
      TOA1: formData.toAchieve1,
      OBJ2: formData.objectif2,
      ACT2: formData.action2,
      TOA2: formData.toAchieve2,
      OWK: formData.othersWillKnow,
      PSB: formData.potentialSabotage,
    };

    try {
      const response = await fetch("/api/user/objectifs/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objectifData),
      });

      if (response.ok) {
        console.log("Données soumises avec succès à la base de données !");
      } else {
        console.error(
          "Échec de la soumission des données à la base de données."
        );
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la requête : ", error);
    }
  };
 
  const getAnthoResponse = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    try {
      const response = await fetch(`/api/user/objectifs/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const objectifsResponse = await response.json();
        // La réponse objectifsResponse est maintenant disponible
        return objectifsResponse;
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
    getAnthoResponse().then((res) => {
      if (res) {
        setFormData({
          ...formData,
          ltg: res.ltg || "",
          action1: res.act1 || "",
          objectif1: res.obj1 || "",
          toAchieve1: res.toa1 || "",
          action2: res.act2 || "",
          objectif2: res.obj2 || "",
          toAchieve2: res.toa2 || "",
          othersWillKnow: res.owk || "",
          potentialSabotage: res.psb || "",
        });
      
        // D'autres mises à jour d'état ici
      }
    });
  }, []);
  

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;
    
    const updateObjectifsData = {
      ID: userId,
      LTG: formData.ltg,
      OBJ1: formData.objectif1,
      ACT1: formData.action1,
      TOA1: formData.toAchieve1,
      OBJ2: formData.objectif2,
      ACT2: formData.action2,
      TOA2: formData.toAchieve2,
      OWK: formData.othersWillKnow,
      PSB: formData.potentialSabotage,
     
    };

    try {
      // Envoi des données pour le métabolisme
      const objectifsResponse = await fetch("/api/user/objectifs/${userId}", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateObjectifsData),
      });
      if (objectifsResponse.ok) {
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
      <div onClick={(e) => e.stopPropagation()} className="p-2">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="flex flex-col">
              Mon objectif d’activité physique à long terme est :
              <textarea
                type="text"
                className="input-log"
                name="ltg"
                value={formData.ltg}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="flex flex-col">
              Objectif no 1 :
              <textarea
                type="text"
                className="input-log"
                name="objectif1"
                value={formData.objectif1}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              Action no 1 :
              <textarea
                type="text"
                className="input-log"
                name="action1"
                value={formData.action1}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Pour l’atteindre, je dois me concentrer sur :
              <textarea
                type="text"
                className="input-log"
                name="toAchieve1"
                value={formData.toAchieve1}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="flex flex-col">
              Objectif no 2 :
              <textarea
                type="text"
                className="input-log"
                name="objectif2"
                value={formData.objectif2}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col">
              Action no 2 :
              <textarea
                type="text"
                className="input-log"
                name="action2"
                value={formData.action2}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Pour y arriver, j’accepte de :
              <textarea
                type="text"
                className="input-log"
                name="toAchieve2"
                value={formData.toAchieve2}
                onChange={handleChange}
              />
            </label>
          </div>
          {/* pour y arriver section */}
          <div>
            <label className="flex flex-col">
              Les autres s’apercevront du changement que j’apporte quand :
              <textarea
                type="text"
                className="input-log"
                name="othersWillKnow"
                value={formData.othersWillKnow}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col">
              Il se pourrait que je sabote mon plan en :
              <textarea
                type="text"
                className="input-log"
                name="potentialSabotage"
                value={formData.potentialSabotage}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="input"><button type="submit">Soumettre</button></div>
          <div className="input"><button onSubmit={handleUpdate} type="submit">Modifier</button></div>
        </form>
      </div>
    </>
  );
}
