import { useState, useEffect, useRef } from "react";

export default function UserMetabol({ closeToggle }) {
  const [anthroId, setAnthroId] = useState("");
  const [metabolId, setMetabolId] = useState("");

  const [poidsKG, setPoidsKG] = useState("");
  const [tailleCM, setHauteurCM] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [coefficientAC, setCoefficientAC] = useState("");

  const getAnthoResponse = async () => {
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.userId;
  
      const anthroResponse = await fetch(`/api/user/anthro/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const metabolResponse = await fetch(`/api/user/metabol/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (anthroResponse.ok && metabolResponse.ok) {
        const anthroData = await anthroResponse.json();
        const metabolData = await metabolResponse.json();
  
        return { anthroData, metabolData };
      }
    } catch (error) {
      // Gestion des erreurs
      console.error("Erreur lors de la récupération des données :", error);
      throw error;
    }
  };

  useEffect(() => {
    getAnthoResponse().then((res) => {
      if (res && res.anthroData.id !== undefined) {
        setAnthroId(res.anthroData.id);
      }
      if (res && res.metabolData.id !== undefined) {
        setMetabolId(res.metabolData.id);
      }
      if (res && res.anthroData.kg !== undefined) {
        setPoidsKG(res.anthroData.kg);
      }
      if (res && res.anthroData.cm !== undefined) {
        setHauteurCM(res.anthroData.cm);
      }
      if (res && res.anthroData.age !== undefined) {
        setAge(res.anthroData.age);
      }
      if (res && res.anthroData.gen !== undefined) {
        setGender(res.anthroData.gen);
      }
      if (res && res.anthroData.ca !== undefined) {
        const coefficientACString = (ca) => {
          let resultat = "";
          if (ca === "1") {
            resultat = "sedentaire";
          } else if (ca === "1.1") {
            resultat = "peuActif";
          } else if (ca === "1.27" || ca === "1.25") {
            resultat = "actif";
          } else {
            resultat = "tresActif";
          }
          return resultat;
        };
        const coefficientString = coefficientACString(res.anthroData.ca);
        setCoefficientAC(coefficientString);
      }
    });
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    const calculatedIMC = calculIMC();
    const calculatedCA = calculCA();
    const calculatedBEE = calculBEE(calculatedCA);
    const calculatedMB = calculMB(calculatedIMC);

    const updateMetabolData = {
      id: metabolId,
      ID: userId,
      CA: calculatedCA,
      MB: calculatedMB,
      BEE: calculatedBEE,
    };

    const updateAnthroData = {
      id: anthroId,
      ID: userId,
      IMC: calculatedIMC.toString(),
      KG: poidsKG.toString(),
      CM: tailleCM.toString(),
      AGE: age.toString(),
      GEN: gender.toString(),
      CA: calculatedCA.toString(),
    };
    try {
      // Envoi des données pour le métabolisme
      const metabolResponse = await fetch(`/api/user/metabol/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateMetabolData),
      });
      if (metabolResponse.ok) {
        closeToggle();
      }

      // Envoi des données pour l'anthropométrie
      const anthroResponse = await fetch(`/api/user/anthro/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateAnthroData),
      });
      if (anthroResponse.ok) {
        closeToggle();
      }
    } catch (error) {
      // Gestion des erreurs
      console.error("Erreur lors de la mise à jour des données :", error);
      // Afficher un message d'erreur à l'utilisateur si nécessaire
    }
  };

  const handleEnregistrer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;
    const calculatedIMC = calculIMC();
    const calculatedCA = calculCA();
    const calculatedBEE = calculBEE(calculatedCA);
    const calculatedMB = calculMB(calculatedIMC);

    const metabolData = {
      ID: userId.toString(),
      CA: calculatedCA.toString(),
      MB: calculatedMB.toString(),
      BEE: calculatedBEE.toString(),
    };

    const anthroData = {
      ID: userId.toString(),
      IMC: calculatedIMC.toString(),
      KG: poidsKG.toString(),
      CM: tailleCM.toString(),
      AGE: age.toString(),
      GEN: gender.toString(),
      CA: calculatedCA.toString(),
    };
    try {
      // Envoi des données pour le métabolisme
      const metabolResponse = await fetch("/api/user/metabol/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metabolData),
      });
      if (metabolResponse.ok) {
        closeToggle();
      }

      // Envoi des données pour l'anthropométrie
      const anthroResponse = await fetch("/api/user/anthro/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(anthroData),
      });
    } catch (error) {
      // Gestion des erreurs
    }
  };

  const calculIMC = () => {
    const tailleM = tailleCM / 100;
    if (tailleM === 0 || poidsKG === 0) {
      return 0;
    }
    const imc = (poidsKG / (tailleM * tailleM)).toFixed(2);
    return parseFloat(imc);
  };

  const calculMB = (imc) => {
    let mb = 0;

    if (imc >= 18.5 && imc <= 25) {
      if (gender === "female") {
        mb = 255 - 2.35 * age + 361.6 * (tailleCM / 100) + 9.39 * poidsKG;
      } else {
        mb = 204 - 4 * age + 450.5 * (tailleCM / 100) + 11.69 * poidsKG;
      }
    } else {
      if (gender === "female") {
        mb = 247 - 2.67 * age + 401.5 * (tailleCM / 100) + 8.6 * poidsKG;
      } else {
        mb = 293 - 3.8 * age + 456.4 * (tailleCM / 100) + 10.12 * poidsKG;
      }
    }
    return Math.round(mb);
  };

  const calculBEE = (CA) => {
    if (gender && age && poidsKG && tailleCM) {
      let bee = 0;

      if (gender === "female") {
        bee = 354 - 6.91 * age + CA * (9.36 * poidsKG + 726 * (tailleCM / 100));
      } else {
        bee =
          662 - 9.53 * age + CA * (15.91 * poidsKG + 539.6 * (tailleCM / 100));
      }
      return Math.round(bee);
    } else {
      return 0; // Ou une valeur par défaut en attendant que toutes les informations soient saisies
    }
  };

  const calculCA = () => {
    if (gender && coefficientAC) {
      let CA;
      switch (gender) {
        case "female":
          switch (coefficientAC) {
            case "sedentaire":
              CA = 1;
              break;
            case "peuActif":
              CA = 1.1;
              break;
            case "actif":
              CA = 1.27;
              break;
            case "tresActif":
              CA = 1.45;
              break;
            default:
              CA = 0; // Valeur par défaut si le coefficientAC n'est pas reconnu
          }
          break;
        case "male":
          switch (coefficientAC) {
            case "sedentaire":
              CA = 1;
              break;
            case "peuActif":
              CA = 1.1;
              break;
            case "actif":
              CA = 1.25;
              break;
            case "tresActif":
              CA = 1.48;
              break;
            default:
              CA = 0; // Valeur par défaut si le coefficientAC n'est pas reconnu
          }
          break;
        default:
          CA = 0; // Valeur par défaut si le genre n'est pas reconnu
      }

      return CA;
    } else {
      return 0; // Ou une valeur par défaut en attendant que toutes les informations soient saisies
    }
  };

  const IMC = calculIMC();
  const CA = calculCA();
  const BEE = calculBEE(CA);
  const MB = calculMB(IMC);
  const BH = BEE / 1000;

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <form>
          <h1 className="">Caloriques Personnalisés</h1>
          <div className="div-calorique">
            <label>Poids en kg : </label>
            <input
              className="input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="200"
              value={poidsKG}
              onChange={(e) => setPoidsKG(e.target.value)}
            />
          </div>
          <div className="div-calorique">
            <label>Taille en cm : </label>
            <input
              className="input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="200"
              value={tailleCM}
              onChange={(e) => setHauteurCM(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="div-calorique">
            <label>Âge : </label>
            <input
              className="input"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              min="0"
              max="200"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-end">
            <select
              className="input-select"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="female">Femme</option>
              <option value="male">Homme</option>
            </select>
            <select
              className="input-select"
              value={coefficientAC}
              onChange={(e) => setCoefficientAC(e.target.value)}
            >
              <option value="sedentaire">Sedentaire</option>
              <option value="peuActif">Peu Actif</option>
              <option value="actif">Actif</option>
              <option value="tresActif">Tres actif</option>
            </select>
          </div>
          <div className="flex justify-between">
            <div className="flex justify-center ">
              <button className="input text-sm" onClick={handleEnregistrer}>
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
          <div className="info-item" aria-label="Indice de Masse Corporelle">
            <h3>IMC : </h3>
            <div>{IMC}</div>
          </div>
          <div className="info-item" aria-label="Métabolisme de Base">
            <h3>MB kcal/jour : </h3>
            <div>{MB}</div>
          </div>
          <div className="info-item" aria-label="Besoins Énergétiques Estimés">
            <h3>BEE kcal/jour :</h3>
            <div>{BEE}</div>
          </div>
          <div className="info-item" aria-label="Besoins Hydriques">
            <h3>BH litre :</h3>
            <div>{BH}</div>
          </div>
        </div>
      </div>
    </>
  );
}
