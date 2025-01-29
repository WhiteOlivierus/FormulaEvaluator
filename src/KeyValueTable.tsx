import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export type KeyValuePair = {
  key: string;
  value: number;
};

type KeyValueTableProps = {
  pairs: KeyValuePair[];
  setPairs: (pairs: KeyValuePair[]) => void;
};

export default function KeyValueTable({ pairs, setPairs }: KeyValueTableProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const addPair = () => {
    if (
      !newKey ||
      isNaN(Number(newValue)) ||
      pairs.some((pair) => pair.key === newKey)
    )
      return;
    setPairs([...pairs, { key: newKey, value: Number(newValue) }]);
    setNewKey("");
    setNewValue("");
  };

  const updateValue = (index: number, newValue: string) => {
    if (isNaN(Number(newValue))) return;
    setPairs(
      pairs.map((pair, i) =>
        i === index ? { ...pair, value: Number(newValue) } : pair
      )
    );
  };

  const updateKey = (index: number, newKey: string) => {
    if (pairs.some((pair, i) => i !== index && pair.key === newKey)) return;
    setPairs(
      pairs.map((pair, i) => (i === index ? { ...pair, key: newKey } : pair))
    );
  };

  const removePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index));
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ maxWidth: 600, margin: "auto", p: 2 }}
    >
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <TextField
          label="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
        />
        <TextField
          label="Value"
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
        />
        <Button variant="contained" onClick={addPair}>
          Add
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pairs.map((pair, index) => (
            <TableRow key={pair.key}>
              <TableCell>
                <TextField
                  value={pair.key}
                  onChange={(e) => updateKey(index, e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={pair.value}
                  onChange={(e) => updateValue(index, e.target.value)}
                />
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={() => removePair(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
