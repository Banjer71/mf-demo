import React from "react";
import Button from "./components/Button";

const App = () => {
  return (
    <div>
      <main>
       
        <Button onClick={() => alert("Button clicked!")}>Click Me</Button>
      </main>
    </div>
  );
};

export default App;
