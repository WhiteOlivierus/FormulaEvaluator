import { useState } from "react";
import KeyValueTable, { KeyValuePair } from "./KeyValueTable";
import FormulaEvaluator from "./FormulaEvaluator";

function App() {
  const [values, setValues] = useState<KeyValuePair[]>([
    { key: "key1", value: 1 },
    { key: "key2", value: 2 },
  ]);
  return (
    <>
      <KeyValueTable pairs={values} setPairs={(v) => setValues(v)} />
      <FormulaEvaluator pairs={values} />
    </>
  );
}

export default App;
