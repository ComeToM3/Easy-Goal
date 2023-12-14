import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Login from "../log/Login";
import Signup from "../log/Signup";

export default function Navbar() {
  const [isOpenToggleLeft, setIsOpenToggleLeft] = useState(false);
  const [isOpenToggleRight, setIsOpenToggleRight] = useState(false);
  const ToggleLeftRef = useRef(null);
  const ToggleRightRef = useRef(null);

  const toggleToggleLeft = () => {
    setIsOpenToggleLeft(!isOpenToggleLeft);
    setIsOpenToggleRight(false); // Pour fermer l'autre liste lorsqu'on ouvre ToggleLeft
  };

  const toggleToggleRight = () => {
    setIsOpenToggleRight(!isOpenToggleRight);
    setIsOpenToggleLeft(false); // Pour fermer l'autre liste lorsqu'on ouvre ToggleRight
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        ToggleLeftRef.current &&
        !ToggleLeftRef.current.contains(event.target) &&
        ToggleRightRef.current &&
        !ToggleRightRef.current.contains(event.target)
      ) {
        setIsOpenToggleLeft(false);
        setIsOpenToggleRight(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
    <>
      <nav className="h-20 rounded-md m-2 bg-sky-50 flex justify-between align-middle items-center">
        <div className="m-2" ref={ToggleLeftRef}>
          <h1 onClick={toggleToggleLeft}>EasyGoal</h1>
        </div>

        <div className="m-2" ref={ToggleRightRef}>
          <h1 onClick={toggleToggleRight}>Bonjour, </h1>
        </div>
      </nav>

      <div className={`toggle-left ${isOpenToggleLeft ? "" : "hidden"}`}>
        {isOpenToggleLeft && (
          <ul>
            <Link href={"/dashboard"}>
              <li>Dashboard</li>
            </Link>
            <li>List item 2</li>
            <li>List item 3</li>
          </ul>
        )}
      </div>
      <div className={`toggle-right ${isOpenToggleRight ? "" : "hidden"}`}>
        {isOpenToggleRight && (
          <ul>
            <li>
              <button onClick={openLogin}>Se Connecter</button>
            </li>
            <li>
              <button onClick={openSignup}>S'inscrire</button>
            </li>
            <li>
              <button >Se Déconnecter</button>
            </li>
          </ul>
        )}
      </div>
      {/* Modal de connexion */}
      {showLogin && <Login onClose={closeModals} />}

      {/* Modal d'inscription */}
      {showSignup && <Signup onClose={closeModals} />}
      
    </>
  );
}
