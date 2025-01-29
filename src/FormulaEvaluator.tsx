import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import List from "@mui/material/List";
import { ListItemButton } from "@mui/material";

type FormulaEvaluatorProps = {
  pairs: { key: string; value: number }[];
};

export default function FormulaEvaluator({ pairs }: FormulaEvaluatorProps) {
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState<number | string>("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredKeys, setFilteredKeys] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const evaluateFormula = (input: string) => {
    try {
      const variables = Object.fromEntries(
        pairs.map((pair) => [pair.key, pair.value])
      );
      const expression = input.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) => {
        return Object.hasOwnProperty.call(variables, match)
          ? variables[match].toString()
          : "NaN";
      });
      const computedResult = new Function(`return ${expression}`)();
      setResult(isNaN(computedResult) ? "Invalid expression" : computedResult);
    } catch {
      setResult("Invalid expression");
    }
  };

  const handleFormulaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormula(value);
    evaluateFormula(value);

    const cursorPosition = e.target.selectionStart || 0;
    const match = value
      .slice(0, cursorPosition)
      .match(/([a-zA-Z_][a-zA-Z0-9_]*)?$/);

    if (match && match[0]) {
      const searchTerm = match[0].toLowerCase();
      const matchedKeys = pairs
        .map((p) => p.key)
        .filter((k) => k.toLowerCase().includes(searchTerm));
      setFilteredKeys(matchedKeys);
      setSelectedIndex(0);
      setAnchorEl(e.target);
    } else {
      setAnchorEl(null);
    }
  };

  const handleKeySelect = (key: string) => {
    if (!inputRef.current) return;
    const cursorPosition = inputRef.current.selectionStart || 0;
    const newFormula =
      formula
        .slice(0, cursorPosition)
        .replace(/([a-zA-Z_][a-zA-Z0-9_]*)?$/, key) +
      formula.slice(cursorPosition);
    setFormula(newFormula);
    evaluateFormula(newFormula);
    setAnchorEl(null);
    inputRef.current.focus();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!filteredKeys.length) return;
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => (prev + 1) % filteredKeys.length);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(
        (prev) => (prev - 1 + filteredKeys.length) % filteredKeys.length
      );
    } else if (e.key === "Enter") {
      handleKeySelect(filteredKeys[selectedIndex]);
    }
  };

  return (
    <Paper sx={{ padding: 2, maxWidth: 600, margin: "auto", marginTop: 2 }}>
      <TextField
        label="Enter Formula"
        fullWidth
        value={formula}
        onChange={handleFormulaChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />
      <Popper
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <Paper>
            <List>
              {filteredKeys.map((key, index) => (
                <ListItemButton
                  key={key}
                  onClick={() => handleKeySelect(key)}
                  selected={index === selectedIndex}
                  sx={{
                    cursor: "pointer",
                    backgroundColor:
                      index === selectedIndex ? "lightgray" : "inherit",
                  }}
                >
                  {key}
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </ClickAwayListener>
      </Popper>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Result: {result}
      </Typography>
    </Paper>
  );
}
