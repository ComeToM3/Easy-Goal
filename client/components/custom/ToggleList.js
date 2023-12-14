import { useState, useEffect, useRef } from 'react';

const ToggleList = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggleList = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={ref}>
      <h1 onClick={toggleList}>{children}</h1>
      {isOpen && <ul>{/* Vos éléments de liste ici */}</ul>}
    </div>
  );
};

export default ToggleList;
