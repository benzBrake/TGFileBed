// Manage Page View
export const managePage = (images, page, totalPages) => `
<!DOCTYPE html>
<html>
<head>
  <title>Manage Images</title>
</head>
<body>
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
          <td>${image.created_at}</td>
          <td><a href="/images/${image.filename}" target="_blank">View</a></td>
          <td><a href="/delete/${image.hash_id}">Delete</a></td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <div>
    ${page > 1 ? `<a href="/manage?page=${page - 1}">Previous</a>` : ''}
    <span>Page ${page} of ${totalPages}</span>
    ${page < totalPages ? `<a href="/manage?page=${page + 1}">Next</a>` : ''}
  </div>
  <div>
    <a href="/delete/all" onclick="return confirm('Are you sure you want to delete all images?');">Delete All Images</a>
  </div>
</body>
</html>
`;