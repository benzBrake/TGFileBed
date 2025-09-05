import manageHTML from './manage.html';

export const managePage = (images, page, totalPages) => {
  const tbody = images.map(image => `
    <tr>
      <td>
        ${image.isImage ?
          `<img src="/images/${image.filename}" alt="${image.original_filename}" class="thumbnail" onclick="showModal('${image.filename}', '${image.original_filename}', ${image.isImage})">` :
          `<div class="file-ext" onclick="showModal('${image.filename}', '${image.original_filename}', ${image.isImage})">${image.filename.split('.').pop().toUpperCase()}</div>`
        }
      </td>
      <td>${image.original_filename || 'N/A'}</td>
      <td>${image.filename}</td>
      <td>${(image.size / 1024).toFixed(2)} KB</td>
      <td>${new Date(image.created_at).toLocaleString()}</td>
      <td><a href="#" onclick="showDeleteModal('${image.hash_id}', '${image.original_filename || image.filename}'); return false;">Delete</a></td>
    </tr>
  `).join('');

  const pagination = `
    ${page > 1 ? `<a href="/manage?page=${page - 1}">Previous</a>` : '<span>Previous</span>'}
    <span>Page ${page} of ${totalPages}</span>
    ${page < totalPages ? `<a href="/manage?page=${page + 1}">Next</a>` : '<span>Next</span>'}
  `;

  return manageHTML
    .replace('{tbody}', tbody)
    .replace('{pagination}', pagination);
};