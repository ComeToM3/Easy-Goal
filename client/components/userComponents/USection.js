import UserObjectifs from "./forms/UserObjectifs";
import UserMacronu from "../userComponents/forms/UserMacronu";
import UserMetabol from "../userComponents/forms/UserMetabol";
import UserMotiv from "../userComponents/forms/UserMotiv";
import ChevronDown from "../icons/ChevronDown";
import { useState, useEffect, useRef } from "react";

export default function USection() {
  const [isOpenToggle1, setIsOpenToggle1] = useState(false);
  const [isOpenToggle2, setIsOpenToggle2] = useState(false);
  const [isOpenToggle3, setIsOpenToggle3] = useState(false);
  const [isOpenToggle4, setIsOpenToggle4] = useState(false);

  const toggleSection = (section) => {
    if (section === 1) {
      setIsOpenToggle1(!isOpenToggle1);
      setIsOpenToggle2(false);
      setIsOpenToggle3(false);
      setIsOpenToggle4(false);
    } else if (section === 2) {
      setIsOpenToggle1(false);
      setIsOpenToggle2(!isOpenToggle2);
      setIsOpenToggle3(false);
      setIsOpenToggle4(false);
    } else if (section === 3) {
      setIsOpenToggle1(false);
      setIsOpenToggle2(false);
      setIsOpenToggle4(false);
      setIsOpenToggle3(!isOpenToggle3);
    } else if (section === 4) {
      setIsOpenToggle1(false);
      setIsOpenToggle2(false);
      setIsOpenToggle3(false);
      setIsOpenToggle4(!isOpenToggle4);
    }
  };

  return (
    <section className="m-2 rounded-md bg-sky-600">
      <div className="container">
        <div className="div-forms" onClick={() => toggleSection(4)}>
          <div className="header w-full">
            <h1 className="text-sky-50 ">Fiche d'Objectifs</h1>
            <ChevronDown />
          </div>
          {isOpenToggle4 && (
            <div className="toggle-forms">
              <UserObjectifs closeToggle={() => setIsOpenToggle4(false)} />
            </div>
          )}
        </div>
      </div>
      <div className="container">
        <div className="div-forms" onClick={() => toggleSection(1)}>
          <div className="header w-full">
            <h1 className="text-sky-50 ">Metabolisme</h1>
            <ChevronDown />
          </div>
          {isOpenToggle1 && (
            <div className="toggle-forms">
              <UserMetabol closeToggle={() => setIsOpenToggle1(false)} />
            </div>
          )}
        </div>
      </div>
      <div className="container">
        <div className="div-forms" onClick={() => toggleSection(2)}>
          <div className="header">
            <h1 className="text-sky-50">Macronutriments</h1>
            <ChevronDown />
          </div>
          {isOpenToggle2 && (
            <div className="toggle-forms">
              <UserMacronu closeToggle={() => setIsOpenToggle2(false)} />
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <div className="div-forms" onClick={() => toggleSection(3)}>
          <div className="header">
            <h1 className="text-sky-50">Motivation</h1>
            <ChevronDown />
          </div>
          {isOpenToggle3 && (
            <div className="toggle-forms">
              <UserMotiv closeToggle={() => setIsOpenToggle3(false)} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
