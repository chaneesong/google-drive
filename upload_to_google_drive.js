const { google } = require('googleapis');
const fs = require('fs');

async function uploadToGoogleDrive(filePath) {
  const credentials = JSON.parse(process.env.GOOGLE_DRIVE_API_CREDENTIALS);

  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/drive']
  );

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: 'MyFile.txt', // 파일 이름
    // parents: ['<Folder ID>']  // 업로드할 폴더의 ID
  };

  const media = {
    mimeType: 'application/octet-stream',
    body: fs.createReadStream(filePath),
  };

  try {
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });

    console.log('File ID:', response.data.id);
  } catch (error) {
    console.error('Error uploading to Google Drive:', error.message);
  }
}

if (require.main === module) {
  uploadToGoogleDrive('path/to/your/file.txt');
}
