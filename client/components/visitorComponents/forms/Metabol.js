import { useState, useEffect, useRef } from "react";

export default function Metabol() {
  const [poidsKG, setPoidsKG] = useState("");
  const [tailleCM, setHauteurCM] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [coefficientAC, setCoefficientAC] = useState("");

  const handleCalculate = async (e) => {
    e.preventDefault();

    const calculatedIMC = calculIMC();
    const calculatedCA = calculCA();
    const calculatedBEE = calculBEE(calculatedCA);
    const calculatedMB = calculMB(calculatedIMC);

    const dataToSend = {
      //Metabolisme
      IMC: calculatedIMC,
      CA: calculatedCA,
      BEE: calculatedBEE,
      MB: calculatedMB,
      //Anthro
      KG: poidsKG,
      CM: tailleCM,
      AGE: age,
      GEN: gender,

      //ID: userId,
    };
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
        <form onClick={handleCalculate}>
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
          <div className="flex justify-center">
            <button className="input" type="submit">
              Calculer
            </button>
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
