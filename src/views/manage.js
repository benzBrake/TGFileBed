// Manage Page View
export const managePage = (images, page, totalPages) => `
<!DOCTYPE html>
<html>
<head>
  <title>Manage Images</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f9; color: #333; margin: 0; padding: 2rem; }
    .container { max-width: 1000px; margin: 0 auto; background: #fff; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    h1 { color: #5a67d8; text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 1.5rem; }
    th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #5a67d8; color: white; }
    tr:hover { background-color: #f5f5f5; }
    a { color: #5a67d8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .pagination { text-align: center; margin-top: 1.5rem; }
    .pagination a, .pagination span { margin: 0 10px; }
    .delete-all { text-align: center; margin-top: 1.5rem; }
    .delete-all a { background-color: #e53e3e; color: white; padding: 10px 15px; border-radius: 4px; }
    .delete-all a:hover { background-color: #c53030; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Manage Images</h1>
    <table>
      <thead>
        <tr>
          <th>Filename</th>
          <th>Size</th>
          <th>Created At</th>
          <th>URL</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${images.map(image => `
          <tr>
            <td>${image.filename}</td>
            <td>${(image.size / 1024).toFixed(2)} KB</td>
            <td>${new Date(image.created_at).toLocaleString()}</td>
            <td><a href="/images/${image.filename}" target="_blank">View</a></td>
            <td><a href="/delete/${image.hash_id}">Delete</a></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="pagination">
      ${page > 1 ? `<a href="/manage?page=${page - 1}">Previous</a>` : '<span>Previous</span>'}
      <span>Page ${page} of ${totalPages}</span>
      ${page < totalPages ? `<a href="/manage?page=${page + 1}">Next</a>` : '<span>Next</span>'}
    </div>
    <div class="delete-all">
      <a href="/delete/all" onclick="return confirm('Are you sure you want to delete all images?');">Delete All Images</a>
    </div>
  </div>
</body>
</html>
`;