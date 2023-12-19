import { useState, useEffect } from "react";
export default function UHeader() {
  const fetchData = async (endpoint) => {
    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;
    try {
      const response = await fetch(`/api/user/${endpoint}/average/${userId}`);
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
        const anthroData = await fetchData("anthro");
        const macronuData = await fetchData("macronu");
        const metabolData = await fetchData("metabol");
        const motivData = await fetchData("motiv");
        const objectifsData = await fetchData("objectifs");

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
          mb: metabolData.mb,
          bee: metabolData.bee,
        });
        const motivValuesMap = {
          precontemplation: "Pre-contemplation",
        };

        const motivValue = motivData.res;
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
        <div className=" p-4">
        <h1>Stats</h1>
          <div className="hidden hover:show header-container ">
            
            <div className=" lg:flex justify-evenly ">
              <div>
                <h2>Mesure Anthropometrique</h2>
                <div className="p-2">
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
                    <label>
                      {" "}
                      Coefficient
                      <br /> d'Activité:{" "}
                    </label>
                    <p>{anthro.ca}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2>Mesure Métaboliques</h2>
                <div className="p-2">
                  <div>
                    <div className="flex justify-between">
                      <label>MB :</label>
                      <p>{metabol.mb} kcal/jour</p>
                    </div>
                    <div className="flex justify-between">
                      <label>BEE :</label>
                      <p>{metabol.bee} kcal/jour</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2>Macronutriments</h2>
                <div className="p-2">
                  <div className="flex justify-between">
                    <label>Glucides</label>
                    <p>
                      {macronu.glcP} % / {macronu.glcG} g
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <label>Protéines</label>
                    <p>
                      {macronu.proP} % / {macronu.proG} g
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <label>Lipides</label>
                    <p>
                      {macronu.lipP} % / &nbsp;&nbsp;{macronu.lipG} g
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2>Motivation au changement</h2>
                <div className="flex justify-between">
                  <label>Resultat :</label>
                  <p> {motiv.res}</p>
                </div>
              </div>

              <div className="hide-small">
                <div>
                  <label>Objectif d’activité à long terme :</label>
                  <p> {objectifs.ltg}</p>
                </div>
                <div>
                  <label>Pour l’atteindre, je dois me concentrer sur :</label>
                  <p> {objectifs.toa1}</p>
                </div>
                <div>
                  <label>Pour y arriver, j’accepte de :</label>
                  <p> {objectifs.toa2}</p>
                </div>
                <div>
                  <label>
                    Les autres s’apercevront du changement que j’apporte quand :
                  </label>
                  <p> {objectifs.owk}</p>
                </div>
                <div>
                  <label>Il se pourrait que je sabote mon plan en :</label>
                  <p> {objectifs.psb}</p>
                </div>
                <div>
                  <label>Je me promets de :</label>
                  <p> {objectifs.ipt}</p>
                </div>
                <div>
                  <label>Objectif 1:</label>
                  <p> {objectifs.obj1}</p>
                </div>
                <div>
                  <label>Action 1 :</label>
                  <p> {objectifs.act1}</p>
                </div>

                <div>
                  <label>Objectif 2 :</label>
                  <p> {objectifs.obj2}</p>
                </div>
                <div>
                  <label>Action 2 :</label>
                  <p> {objectifs.act2}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
