import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './select.css';

export default function BasicSelect({ filter, setFilter }) {

  const filterChange = (event) => {
    setFilter(event.target.value);
    console.log("Filter changed to:", event.target.value);
  };

  return (
    <Box sx={{ minWidth: 150, borderRadius: 2, mx: 1 }} className='select-box'>
      
      <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label" className=''></InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={filter}
          label="Filter"
          onChange={filterChange}
        >
          <MenuItem value={10}>default</MenuItem>
          <MenuItem value={20}>low to high</MenuItem>
          <MenuItem value={30}>high to low</MenuItem>
        </Select>
      </FormControl>

    </Box>
  );
}
