import React from 'react';

const keyboardRows = [
  ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
  ['ENTRÉE', 'W', 'X', 'C', 'V', 'B', 'N', 'EFFACER']
];

export default function Keyboard({ usedKeys, handleKeyup }) {
  const handleClick = (key) => {
    if (key === 'ENTRÉE') {
      handleKeyup({ key: 'Enter' });
    } else if (key === 'EFFACER') {
      handleKeyup({ key: 'Backspace' });
    } else {
      handleKeyup({ key: key });
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center gap-2 px-2 w-full max-w-2xl mx-auto">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1 sm:gap-2 w-full">
          {row.map((key) => {
            const status = usedKeys[key];
            
            let bgClass = "bg-gray-300 text-gray-800 hover:bg-gray-400";
            if (status === 'correct') bgClass = "bg-motus-red text-white";
            if (status === 'present') bgClass = "bg-motus-yellow text-black";
            if (status === 'absent') bgClass = "bg-gray-600 text-white opacity-50";

            const isActionKey = key === 'ENTRÉE' || key === 'EFFACER';

            return (
              <button
                key={key}
                onClick={() => handleClick(key)}
                className={`${bgClass} font-bold rounded cursor-pointer transition-colors duration-200 
                  ${isActionKey ? 'text-xs sm:text-sm px-2 sm:px-4' : 'text-sm sm:text-lg w-8 sm:w-12'} 
                  h-12 sm:h-14 flex items-center justify-center`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}