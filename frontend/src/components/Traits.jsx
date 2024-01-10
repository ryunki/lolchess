
const Traits = ({ showAllTraits }) => {
  
  return (
    <>
    <h3>Selected Champions' Traits</h3>
      <ul>
        {showAllTraits &&
          Object.entries(showAllTraits).map(([key, value]) => {
            return (
              <li key={key}>
                {key}: {value}
              </li>
            );
          })}
      </ul>
    </>
    
  );
};

export default Traits;
