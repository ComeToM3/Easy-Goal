import { useState, useEffect } from "react";

export default function UHeader() {
  const fetchData = async (endpoint) => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;
    try {
      const response = await fetch(`/api/user/${endpoint}/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error(
          `Erreur lors de la récupération des données pour ${endpoint}`
        );
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const [anthro, setAnthro] = useState({
    imc: "",
    kg: "",
    cm: "",
    age: "",
    gen: "",
  });
  const [macronu, setMacronu] = useState({
    glcP: "",
    proP: "",
    lipP: "",
    glcG: "",
    proG: "",
    lipG: "",
  });
  const [metabol, setMetabol] = useState({
    mb: "",
    bee: "",
    ca: "",
  });

  const [objectifs, setObjectifs] = useState({
    ltg: "",
    obj1: "",
    act1: "",
    toa1: "",
    obj2: "",
    act2: "",
    toa2: "",
    owk: "",
    psb: "",
  });
  const [motiv, setMotiv] = useState({
    res: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const anthroData = await fetchData("anthro/average");
        const macronuData = await fetchData("macronu/average");
        const metabolData = await fetchData("metabol/average");
        const motivData = await fetchData("motiv/average");
        const objectifsData = await fetchData("objectifs/average");

        setAnthro({
          ...anthro,
          imc: anthroData.imc,
          kg: anthroData.kg,
          cm: anthroData.cm,
          age: anthroData.age,
          gen: anthroData.gen,
          ca: anthroData.ca,
        });
        setMacronu({
          ...macronu,
          glcP: macronuData.glcP,
          proP: macronuData.proP,
          lipP: macronuData.lipP,
          glcG: macronuData.glcG,
          proG: macronuData.proG,
          lipG: macronuData.lipG,
        });
        setMetabol({
          ...metabol,
          mb: metabolData[0].mb,
          bee: metabolData[0].bee,
        });
        const motivValuesMap = {
          precontemplation: "Pre-contemplation",
        };

        const motivValue = motivData[0].res;
        const transformedMotivValue = motivValuesMap[motivValue.toLowerCase()];
        setMotiv({
          ...motiv,
          res: transformedMotivValue || motivValue,
        });
        setObjectifs({
          ...objectifs,
          ltg: objectifsData.ltg,
          obj1: objectifsData.obj1,
          act1: objectifsData.act1,
          toa1: objectifsData.toa1,
          obj2: objectifsData.obj2,
          act2: objectifsData.act2,
          toa2: objectifsData.toa2,
          owk: objectifsData.owk,
          psb: objectifsData.psb,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <header className=" m-2 bg-sky-600 rounded-md">
        <div className="p-2">
          <div className="header-container">
            <div className="flex justify-evenly">
              <div >
                <h2>Mesure Anthropometrique</h2>
                <div className="flex justify-between">
                  <label> IMC :</label>
                  <p>{anthro.imc}</p>
                </div>
                <div className="flex justify-between">
                  <label>Poids: </label>
                  <p>{anthro.kg} kg</p>
                </div>
                <div className="flex justify-between">
                  <label>Taille: </label>
                  <p>{anthro.cm} cm</p>
                </div>
                <div className="flex justify-between">
                  <label> Âge: </label>
                  <p>{anthro.age} </p>
                </div>
                <div className="flex justify-between">
                  <label>Genre: </label>
                  <p>{anthro.gen}</p>
                </div>
                <div className="flex justify-between items-center">
                  <label> Coefficient<br/> d'Activité: </label>
                  <p>{anthro.ca}</p>
                </div>
              </div>

              <div>
                <h2>Mesure Métaboliques</h2>
                <p>MB: {metabol.mb} kcal/jour</p>
                <p>BEE: {metabol.bee} kcal/jour</p>
                <p>
                  Glucides : {macronu.glcP} % / {macronu.glcG} g
                </p>
                <p>
                  Protéines : {macronu.proP} % / {macronu.proG} g
                </p>
                <p>
                  Lipides : {macronu.lipP} % / {macronu.lipG} g
                </p>
              </div>

              <div>
                <h2>Échelle d’évaluation de la motivation au changement</h2>

                <p>Resultat: {motiv.res}</p>
                <p>LTG: {objectifs.ltg}</p>
                <p>Obj1: {objectifs.obj1}</p>
                <p>Act1: {objectifs.act1}</p>
                <p>Toa1: {objectifs.toa1}</p>
                <p>Obj2: {objectifs.obj2}</p>
                <p>Act2: {objectifs.act2}</p>
                <p>Toa2: {objectifs.toa2}</p>
                <p>OWK: {objectifs.owk}</p>
                <p>PSB: {objectifs.psb}</p>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
