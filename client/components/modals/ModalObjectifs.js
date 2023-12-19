export default function ModalObjectifs({ onClose }) {
  return (
    <>
      <div className="overlay">
        <div className="obj-modal">
          <p>
            Cette exercice vous aidera à de documenter vos objectifs et
            obstacles globaux en matière d’activité physique. Vous pouvez rêver
            un peu et viser à atteindre ces objectifs à long terme en environ un
            an, assurez-vous seulement qu'ils soient réalistes. Une fois que
            vous aurez rempli la partie 1, décomposez les objectifs globaux en
            une série d’objectifs et d’actions à court terme pour les 1 à 4
            prochaines semaines. Mettre en pratique les objectifs avec SMART :
          </p>

          <div>
            <p>
              Une fois que vous aurez rempli la partie 1, décomposez les
              objectifs globaux en une série d’objectifs et d’actions à court
              terme pour les 1 à 4 prochaines semaines.
            </p>
          </div>
          <button onClick={onClose}>Fermer</button>
        </div>
      </div>
    </>
  );
}
