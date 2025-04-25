import * as TaskManager from 'expo-task-manager';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

const LOCATION_TASK_NAME = 'background-location-task';
const FILE_PATH = FileSystem.documentDirectory + 'location_log.xlsx';

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }

  const currentHour = new Date().getHours();
  if (currentHour < 10 || currentHour >= 19) {
    if (await FileSystem.getInfoAsync(FILE_PATH).then(info => info.exists)) {
      // Optional: You can call an API here to upload/send the file to email
      await FileSystem.deleteAsync(FILE_PATH);
      console.log('File deleted after 7 PM');
    }
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];

    if (location) {
      const timestamp = new Date().toLocaleString();
      const entry = {
        Latitude: location.coords.latitude,
        Longitude: location.coords.longitude,
        Timestamp: timestamp,
      };

      let dataRows = [];
      const fileExists = await FileSystem.getInfoAsync(FILE_PATH).then(res => res.exists);

      if (fileExists) {
        const raw = await FileSystem.readAsStringAsync(FILE_PATH, { encoding: FileSystem.EncodingType.Base64 });
        const workbook = XLSX.read(raw, { type: 'base64' });
        const sheet = workbook.Sheets['Log'];
        dataRows = XLSX.utils.sheet_to_json(sheet);
      }

      dataRows.push(entry);

      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Log');
      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });

      await FileSystem.writeAsStringAsync(FILE_PATH, wbout, { encoding: FileSystem.EncodingType.Base64 });
      console.log('Location logged:', entry);
    }
  }
});
