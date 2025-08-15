// Upload Page View
export const uploadPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Upload Image</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f9; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
    .container { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; }
    h1 { color: #5a67d8; }
    form { margin-top: 1.5rem; }
    input[type="file"] { border: 1px solid #ddd; padding: 10px; border-radius: 4px; }
    input[type="submit"] { background-color: #5a67d8; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s; }
    input[type="submit"]:hover { background-color: #434190; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Upload Image to Telegram Filebed</h1>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="file" id="file" required>
      <input type="submit" value="Upload">
    </form>
  </div>
</body>
</html>
`;