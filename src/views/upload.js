// Upload Page View
export const uploadPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Upload File</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f9; color: #333; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 1rem; box-sizing: border-box; }
    .container { background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; width: 100%; max-width: 500px; }
    h1 { color: #5a67d8; margin-bottom: 1.5rem; }
    #uploadForm { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    #file { display: none; }
    .file-label { background-color: #5a67d8; color: white; border: none; padding: 12px 20px; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background-color 0.3s; display: inline-block; }
    .file-label:hover { background-color: #434190; }
    #fileName { margin-top: 0.5rem; color: #555; font-style: italic; }
    #status { margin-top: 1rem; font-weight: bold; }
    #results { margin-top: 1.5rem; text-align: left; width: 100%; display: none; }
    .link-container { margin-bottom: 1rem; }
    .link-container label { font-weight: bold; display: block; margin-bottom: 0.5rem; color: #333; }
    .input-group { display: flex; }
    .link-container input { flex-grow: 1; border: 1px solid #ddd; padding: 8px; border-radius: 4px 0 0 4px; background: #f9f9f9; }
    .copy-btn { background-color: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 0 4px 4px 0; cursor: pointer; transition: background-color 0.3s; }
    .copy-btn:hover { background-color: #5a6268; }
    .copy-btn.copied { background-color: #28a745; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Upload File to TGFileBed</h1>
    <form id="uploadForm">
      <label for="file" class="file-label">Choose File</label>
      <input type="file" name="file" id="file" required>
      <div id="fileName">No file chosen</div>
    </form>
    <div id="status"></div>
    <div id="results"></div>
  </div>

  <script>
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('file');
    const fileNameDisplay = document.getElementById('fileName');
    const statusDisplay = document.getElementById('status');
    const resultsDisplay = document.getElementById('results');

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameDisplay.textContent = fileInput.files[0].name;
        handleUpload();
      } else {
        fileNameDisplay.textContent = 'No file chosen';
      }
    });

    const handleUpload = async () => {
      const file = fileInput.files[0];
      if (!file) {
        statusDisplay.textContent = 'Please select a file first.';
        statusDisplay.style.color = 'red';
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      statusDisplay.textContent = 'Uploading...';
      statusDisplay.style.color = '#5a67d8';
      resultsDisplay.style.display = 'none';
      resultsDisplay.innerHTML = '';

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Unknown error occurred');
        }

        statusDisplay.textContent = 'Upload successful!';
        statusDisplay.style.color = 'green';
        displayResults(result.url, result.original_filename);

      } catch (error) {
        statusDisplay.textContent = \`Upload failed: \${error.message}\`;
        statusDisplay.style.color = 'red';
      }
    };
    
    const displayResults = (url, originalFilename) => {
      const isImage = /\.(bmp|jpe?g|png|gif|svg|webp|ico|tiff)$/i.test(originalFilename);
      const fileName = originalFilename.replace(/\.\w+$/, '');
      const bbcode = \`[img]\${url}[/img]\`;
      const markdown = \`![\${fileName}](\${url})\`;
      const html = isImage? \`<img src="\${url}" alt="\${fileName}">\` : \`<a href="\${url}" target="_blank">\${fileName}</a>\`;

      resultsDisplay.innerHTML = \`
        <div class="link-container">
          <label>URL</label>
          <div class="input-group">
            <input type="text" value="\${url}" readonly>
            <button class="copy-btn">Copy</button>
          </div>
        </div>
        <div class="link-container">
          <label>BBCode</label>
          <div class="input-group">
            <input type="text" value="\${bbcode}" readonly>
            <button class="copy-btn">Copy</button>
          </div>
        </div>
        <div class="link-container">
          <label>Markdown</label>
          <div class="input-group">
            <input type="text" value="\${markdown}" readonly>
            <button class="copy-btn">Copy</button>
          </div>
        </div>
        <div class="link-container">
          <label>HTML</label>
          <div class="input-group">
            <input type="text" value='\${html}' readonly>
            <button class="copy-btn">Copy</button>
          </div>
        </div>
      \`;
      resultsDisplay.style.display = 'block';
      addCopyListeners();
    };

    const addCopyListeners = () => {
      document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
          const input = button.previousElementSibling;
          navigator.clipboard.writeText(input.value).then(() => {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');
            setTimeout(() => {
              button.textContent = originalText;
              button.classList.remove('copied');
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy text: ', err);
          });
        });
      });
    };
  </script>
</body>
</html>
`;