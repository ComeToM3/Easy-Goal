import { useState, useEffect, useRef } from "react";

export default function Motiv({ closeToggle }) {
  const questions = [
    /* Liste de tes questions ici */

    "D'après moi, je n'ai auncun problème qui nécessite un changement",
    "Je pense que je suis prêt(e) à faire quelque chose pour m'améliorer",
    "Je fais quelque chose au sujet des problèmes qui me dérangeaient",
    "Ça vaudrait la peine de travailler sur mon problème",
    "Ce n'est pas moi qui ai un problème; ça n'a pas de sens pour moi d'être ici",
    "Ça m'inquiète de savoir que le problème que j'avais réglé pourrait revenir, alors je viens ici pour chercher de l'aide",
    "Je travail en sur mon problème",
    "J'ai pensé à changer quelque chose à propos de moi-même",
    "J'ai réussi à travailler sur mon problème, mais je ne suis pas certain de pouvoir mettre les efforts par moi-même",
    "Parfois, mon problème est difficile mais je travaille dessus",
    "C'est plutôt une perte de temps pour moi d'être ici car le problème n'a rien à voir avec moi",
    "J'espère qu'ici on m'aidera à mieux me comprendre",
    "Je suppose que j'ai des défauts mais il n'y a rien que j'ai vraiment besoin de changer",
    "Je travail vraiment fort pour changer",
    "J'ai un problème et je pense vraiment que j'ai besoin de changer",
    "Je n'ai pas persévéré aussi bien que je l'avais espéré dans les changements que j'ai fait, alors je suis ici pour éviter que mon problème revienne",
    "Même si je ne réussis pas toujours à changer avec succès, au moins je travaille sur mon problème",
    "Je pensais qu'une fois que j'aurais réglé mon problème j'an serais débarrassé, mais parfois il m'arrive encore de me retrouver pris avec le même problème",
    "J'aimerais avoir plus d'idées sur la façon de régler mon problème",
    "J'ai commencé à travailler sur mes problèmes, mais j'aimerais avoir de l'aide",
    "Peut-être ici on va pouvoir m'aider",
    "J'aurais besoin d'un coup de main en ce moment pour m'aider à maintenir les changements que j'ai déjà faits",
    "J'ai peut-être une part de responsabilités dans le problème, mais je ne pense pas vraiment",
    "J'espère que quelqu'un ici va pourvoir me donner de bons conseils",
    "N'importe qui peut parler de changer; moi je fais vraiment quelque chose à ce sujet",
    "C'est ennuyant ces discussions à propos de psychologie. Pourquoi les gens ne peuvent-ils pas juste oublier leurs problèmes",
    "Je suis ici pour éviter que mon problème ne revienne",
    "C'est frustrant, j'ai l'impression que mon problème pourrait revenir même si je croyais lavoir réglé",
    "J'ai des soucis comme tout le monde. POurquoi perdre du temps sur mon problème",
    "Je travaille activement sur mon problème",
    "Je préfèrerais m'accomoder de mes défauts plutôt que d'essayer de les changer",
    "Après tout ce que j'ai fait pour essayer de changer mon problème, ça revient encore m'obséder.",
  ];

  const optionsLabels = {
    1: " 1. Fortement en désaccord",
    2: " 2. Moyennement en désaccord",
    3: " 3. Neutre ou indécis",
    4: " 4. Moyennement en accord",
    5: " 5. Fortement en accord",
  };
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    Array.from({ length: questions.length }, () => "")
  );
  const [showNextButton, setShowNextButton] = useState(false);

  const handleRadioChange = (e) => {
    const index = currentQuestion;
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    const currentRadio = document.querySelector(
      `input[name=question${currentQuestion}]:checked`
    );
    if (currentRadio) {
      const selectedValue = currentRadio.value;
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = selectedValue;
      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setShowNextButton(false);
      }
    } else {
      ("Veuillez sélectionner une réponse");
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };
  useEffect(() => {
    let timer;
    if (currentQuestion < questions.length - 1) {
      timer = setTimeout(() => {
        setShowNextButton(true); // Afficher le bouton Suivant après le délai
      }, 100); // Timer de 5 secondes
    }
    return () => clearTimeout(timer);
  }, [currentQuestion, questions.length]);

  const handleSave = async () => {
    const reponsesParsees = answers.map((response) =>
      parseInt(response || "0", 10)
    );

    const PCIndices = [0, 4, 10, 12, 31, 25, 28, 30];
    const CIndices = [1, 3, 7, 11, 14, 18, 20, 23];
    const AIndices = [2, 6, 9, 13, 16, 19, 24, 29];
    const MIndices = [5, 8, 15, 17, 21, 26, 27, 31];

    const PC = PCIndices.map((index) => ({
      index,
      value: reponsesParsees[index],
    }));
    const C = CIndices.map((index) => ({
      index,
      value: reponsesParsees[index],
    }));
    const A = AIndices.map((index) => ({
      index,
      value: reponsesParsees[index],
    }));
    const M = MIndices.map((index) => ({
      index,
      value: reponsesParsees[index],
    }));

    const calculerMoyenneSansElement = (groupe, excludingIndex) => {
      const filteredValues = groupe
        .filter((item) => item.index !== excludingIndex)
        .map((item) => item.value);
      const sum = filteredValues.reduce((acc, value) => acc + value, 0);
      return sum / filteredValues.length;
    };

    const moyPC = calculerMoyenneSansElement(PC, 9);
    const moyC = calculerMoyenneSansElement(C, 3);
    const moyA = calculerMoyenneSansElement(A, 7);
    const moyM = calculerMoyenneSansElement(M, 3);

    const calculFinal = (moyC + moyA + moyM - moyPC).toFixed(0);

    const resultat = (res) => {
      if (res <= 8) {
        return "precontemplation";
      } else if (res > 8 && res < 11) {
        return "contemplation";
      } else if (res > 11 && res < 14) {
        return "preparation";
      } else if (res >= 14) {
        return "maintien";
      }
      return "Une erreur s'est produite";
    };

    const PCValues = PC.map((item) => item.value);
    const CValues = C.map((item) => item.value);
    const AValues = A.map((item) => item.value);
    const MValues = M.map((item) => item.value);

    const token = localStorage.getItem("token");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const userId = decodedToken.userId;

    const dataPreContemp = {
      ID: userId,
      q1: PCValues[0].toString(),
      q5: PCValues[1].toString(),
      q11: PCValues[2].toString(),
      q13: PCValues[3].toString(),
      q32: PCValues[4].toString(),
      q26: PCValues[5].toString(),
      q29: PCValues[6].toString(),
      q31: PCValues[7].toString(),
    };
    const dataContemp = {
      ID: userId,
      q2: CValues[0].toString(),
      q4: CValues[1].toString(),
      q8: CValues[2].toString(),
      q12: CValues[3].toString(),
      q15: CValues[4].toString(),
      q19: CValues[5].toString(),
      q21: CValues[6].toString(),
      q24: CValues[7].toString(),
    };

    const dataAction = {
      ID: userId,
      q3: AValues[0].toString(),
      q7: AValues[1].toString(),
      q10: AValues[2].toString(),
      q14: AValues[3].toString(),
      q17: AValues[4].toString(),
      q20: AValues[5].toString(),
      q25: AValues[6].toString(),
      q30: AValues[7].toString(),
    };

    const dataMaintenance = {
      ID: userId,
      q6: MValues[0].toString(),
      q9: MValues[1].toString(),
      q16: MValues[2].toString(),
      q18: MValues[3].toString(),
      q22: MValues[4].toString(),
      q27: MValues[5].toString(),
      q28: MValues[6].toString(),
      q32: MValues[7].toString(),
    };

    const dataRes = {
      ID: userId,
      moyPc: moyPC.toFixed(0).toString(),
      moyC: moyC.toFixed(0).toString(),
      moyA: moyA.toFixed(0).toString(),
      moyM: moyM.toFixed(0).toString(),
      res: resultat(calculFinal),
    };
    
    const allData = {
      dataPreContemp,
      dataContemp,
      dataAction,
      dataMaintenance,
      dataRes,
    };
    try {
      const response = await fetch("/api/user/motiv/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(allData),
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

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-center">
        <div className="flex flex-col">
          <div className=" text-justify ">
            <div className="bg-sky-100 rounded-md p-2">
              <h1>
                Pensez à un changement en terme d'activité physique et/ou de saines habitudes de vies que vous cherchez à accomplir.
              </h1>
              <br/>
              <p>
                Lisez attentivement les questions et répondez le chiffre correspondant à votre situation. Il n'y a
                pas de bonnes ou de mauvaises réponses.
              </p>
              <br/>

              <p>Le questionnaire prend entre 5 et 15 minutes à compter</p>
              <br/>

            </div>
            <h1>Question {currentQuestion + 1}</h1>
            <p className="m-2 pr-3 ">{questions[currentQuestion]}</p>
          </div>
          <div className="flex flex-col ">
            {[1, 2, 3, 4, 5].map((option) => (
              <div key={option}>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name={`question${currentQuestion}`}
                      value={option}
                      checked={answers[currentQuestion] === `${option}`}
                      onChange={handleRadioChange}
                    />
                    {optionsLabels[option]}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-2 ">
        <div className=" flex gap-3">
          {currentQuestion > 0 && (
            <button className="input" onClick={handlePrev}>
              Retour
            </button>
          )}
          {showNextButton && currentQuestion < questions.length - 1 && (
            <button className="input" onClick={handleNext}>
              Suivant
            </button>
          )}
          {currentQuestion === questions.length - 1 && (
            <button className="input" onClick={handleSave}>
              Soumettre
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
