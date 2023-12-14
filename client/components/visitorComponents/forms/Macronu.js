import { useState, useEffect, useRef } from "react";
import Link from 'next/link'

export default function Macronu () {

    const [glucidesP, setGlucidesP] = useState("");
    const [proteinesP, setProteinesP] = useState("");
    const [lipidesP, setLipidesP] = useState("");
    const [gender, setGender] = useState("");
    const [coefficientAC, setCoefficientAC] = useState("");
  


    return (
    <>
<form className="h-full" onClick={(e) => e.stopPropagation()}>
        <h1 className=""> Besoins Énergétiques</h1>
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
            onClick={(e) => e.stopPropagation()}
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
          />
        </div>

        <div className="flex justify-center">
          <button className="input" type="submit">
            Calculer
          </button>
        </div>
      </form>
    </>
  );
}