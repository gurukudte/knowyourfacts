const axios = require('axios');

const payload = {
  "summary": {
    "Name": "recording_user-slug_231125",
    "Date": "231125",
    "Total Sessions": 5,
    "Start Time": "10:30:00",
    "End Time": "16:45:00",
    "Total Recording Time": "04:15:00",
    "Total Break Duration": "01:00:00"
  },
  "sessions": [
    {
      "Session #": 1,
      "Start (Time)": "10:30:00",
      "End (Time)": "11:15:00",
      "Break (min)": 0,
      "Mic (min)": 45.0,
      "Sys (min)": 45.0,
      "Max (min)": 45.0,
      "Mic .wav": "Y",
      "Sys .wav": "Y",
      "Timestamp": "20231125_103000"
    },
    {
      "Session #": 2,
      "Start (Time)": "11:30:00",
      "End (Time)": "12:15:00",
      "Break (min)": 15.0,
      "Mic (min)": 45.0,
      "Sys (min)": 45.0,
      "Max (min)": 45.0,
      "Mic .wav": "Y",
      "Sys .wav": "Y",
      "Timestamp": "20231125_113000"
    }
  ]
};

async function testUpload() {
  try {
    const response = await axios.post('http://localhost:3000/api/upload-session', payload);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testUpload();
