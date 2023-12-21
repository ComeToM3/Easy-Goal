import ModalObjectifs from "@/components/modals/ModalObjectifs";
import { useState, useEffect, useRef } from "react";

export default function FicheInfo({ closeToggle }) {
  const [formData, setFormData] = useState({
    ltg: "",
    toAchieveConcentrate: "",
    toAchieveAccept: "",
    othersWillKnow: "",
    potentialSabotage: "",
    iPromiseTo: "",
    action1: "",
    objectif1: "",
    action2: "",
    objectif2: "",
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
      TOA1: formData.toAchieveConcentrate,
      TOA2: formData.toAchieveAccept,
      OWK: formData.othersWillKnow,
      PSB: formData.potentialSabotage,
      IPT: formData.iPromiseTo,
      OBJ1: formData.objectif1,
      ACT1: formData.action1,
      OBJ2: formData.objectif2,
      ACT2: formData.action2,
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
          toAchieveConcentrate: res.toa1 || "",
          toAchieveAccept: res.toa2 || "",
          othersWillKnow: res.owk || "",
          potentialSabotage: res.psb || "",
          iPromiseTo: res.ipt || "",
          objectif1: res.obj1 || "",
          action1: res.act1 || "",
          objectif2: res.obj2 || "",
          action2: res.act2 || "",
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
      TOA1: formData.toAchieveConcentrate,
      OBJ2: formData.objectif2,
      ACT2: formData.action2,
      TOA2: formData.toAchieveAccept,
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

  const [showModal, setShowModal] = useState(false);
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const [showSpecifique, setShowSpecifique] = useState(false);
  const [showMesurable, setShowMesurable] = useState(false);

  const [showAction, setShowAction] = useState(false);
  const [showRevelateur, setShowRevelateur] = useState(false);
  const [showTemporel, setShowTemporel] = useState(false);

  const openSpecifique = () => {
    setShowSpecifique(true);
    setTimeout(() => {
      setShowSpecifique(false);
    }, 5000);
  };

  const openMesurable = () => {
    setShowMesurable(true);
    setTimeout(() => {
      setShowMesurable(false);
    }, 5000);
  };

  const openAction = () => {
    setShowAction(true);
    setTimeout(() => {
      setShowAction(false);
    }, 5000);
  };

  const openRevelateur = () => {
    setShowRevelateur(true);
    setTimeout(() => {
      setShowRevelateur(false);
    }, 5000);
  };
  const openTemporel = () => {
    setShowTemporel(true);
    setTimeout(() => {
      setShowTemporel(false);
    }, 5000);
  };

  return (
    <>
      <div onClick={(e) => e.stopPropagation()} className="p-2 flex flex-col gap-2">
        {showModal && <ModalObjectifs onClose={closeModal} />}

        <h2>Objectifs avec SMART :</h2>
        <ul>
          <li className="cursor-pointer text-sky-200" onClick={openSpecifique}>
            <strong>Spécifiques :</strong> Clairs et bien définis.
          </li>

          {showSpecifique && (
            <li>
              Exemple : « Je bougerai plus chaque semaine durant ma pause du
              dîner au travail. »
            </li>
          )}

          <li className="cursor-pointer text-sky-200" onClick={openMesurable}>
            <strong>Mesurables :</strong> Objectifs et quantifiables, pour
            déterminer quand ils sont atteints.
          </li>
          {showMesurable && (
            <li>
              Exemple : « Je viserai 3 fois par semaine pendant 4 semaines
              consécutives. »
            </li>
          )}
          <li className="cursor-pointer text-sky-200" onClick={openAction}>
            <strong>Basés sur l’Action :</strong> Fondés sur les actions que
            vous réaliserez.
          </li>
          {showAction && (
            <li>
              Exemple : « Je vais aller marcher deux fois par semaine et me
              joindrai à un cours une fois par semaine. »
            </li>
          )}
          <li className="cursor-pointer text-sky-200" onClick={openRevelateur}>
            <strong>Révélateurs :</strong> Importants et significatifs pour
            vous.
          </li>
          {showRevelateur && (
            <li>
              Exemple : « Il est important pour moi de bouger plus sur une base
              régulière, pendant la journée. »
            </li>
          )}

          <li className="cursor-pointer text-sky-200" onClick={openTemporel}>
            <strong>Temporels :</strong> Associés à une échéance avec une date
            limite.
          </li>
          {showTemporel && (
            <li>
              Exemple : « Je vais commencer lundi et suivre ma progression. »
            </li>
          )}
        </ul>
        <h1 onClick={openModal} className="cursor-pointer text-2xl flex justify-center">
          Instruction
        </h1>

        <form onSubmit={handleSubmit}>
          <div>
            <h2>Partie 1</h2>
            <label className="flex flex-col text-sky-200">
              Mon objectif d’activité physique à long terme est :
              <textarea
                type="text"
                className="input-log text-black"
                name="ltg"
                value={formData.ltg}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col text-sky-200">
              Pour l’atteindre, je dois me concentrer sur :
              <textarea
                type="text"
                className="input-log text-black"
                name="toAchieveConcentrate"
                value={formData.toAchieveConcentrate}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col text-sky-200">
              Pour y arriver, j’accepte de :
              <textarea
                type="text"
                className="input-log text-black"
                name="toAchieveAccept"
                value={formData.toAchieveAccept}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col text-sky-200">
              Les autres s’apercevront du changement que j’apporte quand :
              <textarea
                type="text"
                className="input-log text-black"
                name="othersWillKnow"
                value={formData.othersWillKnow}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col text-sky-200">
              Il se pourrait que je sabote mon plan en : Ainsi, je me promets de
              :
              <textarea
                type="text"
                className="input-log text-black"
                name="potentialSabotage"
                value={formData.potentialSabotage}
                onChange={handleChange}
              />
            </label>
          </div>
          <div>
            <label className="flex flex-col text-sky-200">
              Ainsi, je me promets de :
              <textarea
                type="text"
                className="input-log text-black"
                name="iPromiseTo"
                value={formData.iPromiseTo}
                onChange={handleChange}
              />
            </label>
          </div>
          <h2>Partie 2</h2>
          <div className="flex flex-col">
            <label className="flex flex-col text-sky-200 ">
              Objectif no 1 :
              <textarea
                type="text"
                className="input-log text-black"
                name="objectif1"
                value={formData.objectif1}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col text-sky-200">
              Action no 1 :
              <textarea
                type="text"
                className="input-log text-black"
                name="action1"
                value={formData.action1}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="flex flex-col">
            <label className="flex flex-col text-sky-200">
              Objectif no 2 :
              <textarea
                type="text"
                className="input-log text-black"
                name="objectif2"
                value={formData.objectif2}
                onChange={handleChange}
              />
            </label>
            <label className="flex flex-col text-sky-200">
              Action no 2 :
              <textarea
                type="text"
                className="input-log text-black"
                name="action2"
                value={formData.action2}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="input">
            <button type="submit">Soumettre</button>
          </div>
          <div className="input">
            <button onSubmit={handleUpdate} type="submit">
              Modifier
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
