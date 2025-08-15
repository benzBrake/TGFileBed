// Upload Page View
export const uploadPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Upload Image</title>
</head>
<body>
  <h1>Upload Image to Telegram Filebed</h1>
  <form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" id="file">
    <input type="submit" value="Upload">
  </form>
</body>
</html>
`;