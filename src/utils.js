// Utility functions

// Generate a random hash
export const generateHash = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get file extension from filename
export const getFileExtension = (filename) => {
  if (typeof filename !== 'string') return '';
  const match = filename.match(/\.([a-zA-Z0-9]{1,5})$/);
  return match ? match[1].toLowerCase() : '';
};

// Get file extension from MIME type
export const getExtensionFromMimeType = (mimeType) => {
  if (!mimeType || typeof mimeType !== 'string') return '';

  const mimeToExtension = {
    // Images
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/bmp': 'bmp',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',

    // Documents
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.ms-office': 'doc', // 通用 Office 文档

    // Text files
    'text/plain': 'txt',
    'text/plain; charset=utf-8': 'txt',
    'text/plain; charset=utf-16be': 'txt',
    'text/plain; charset=utf-16le': 'txt',
    'text/html': 'html',
    'text/css': 'css',
    'text/javascript': 'js',
    'application/json': 'json',
    'application/xml': 'xml',

    // Audio
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/ogg': 'ogg',
    'audio/aac': 'aac',
    'audio/flac': 'flac',

    // Video
    'video/mp4': 'mp4',
    'video/mpeg': 'mpeg',
    'video/quicktime': 'mov',
    'video/x-msvideo': 'avi',
    'video/x-ms-wmv': 'wmv',
    'video/webm': 'webm',

    // Archives
    'application/zip': 'zip',
    'application/x-rar-compressed': 'rar',
    'application/x-tar': 'tar',
    'application/x-7z-compressed': '7z',
    'application/gzip': 'gz',

    // Executables
    'application/x-elf-executable': 'elf',
    'application/x-dosexec': 'exe',

    // Other
    'application/octet-stream': 'bin'
  };

  return mimeToExtension[mimeType.toLowerCase()] || '';
};

// 从文件内容获取MIME类型
export const getMimeTypeFromFileContent = async (file) => {
  if (!file || !(file instanceof File)) return '';

  // 如果File对象已经有type属性且不为空，优先使用
  if (file.type && file.type !== 'application/octet-stream') {
    return file.type;
  }

  // 读取文件前几个字节来检测MIME类型
  try {
    const buffer = await file.slice(0, 4).arrayBuffer();
    const arr = new Uint8Array(buffer);

    // 常见文件类型的魔数检测

    // 图片格式
    if (arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF) {
      return 'image/jpeg';
    }
    if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47) {
      return 'image/png';
    }
    if (arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) {
      return 'image/gif';
    }
    if (arr[0] === 0x42 && arr[1] === 0x4D) {
      return 'image/bmp';
    }
    if (arr[0] === 0x49 && arr[1] === 0x49 && arr[2] === 0x2A && arr[3] === 0x00) {
      return 'image/tiff';
    }
    if (arr[0] === 0x4D && arr[1] === 0x4D && arr[2] === 0x00 && arr[3] === 0x2A) {
      return 'image/tiff';
    }
    if (arr[0] === 0x00 && arr[1] === 0x00 && arr[2] === 0x01 && arr[3] === 0x00) {
      return 'image/x-icon';
    }

    // WebP 文件的魔数检测: "RIFF" + 4字节文件大小 + "WEBP"
    if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46) {
      // 读取更多字节来确认是 WebP 格式
      try {
        const webpBuffer = await file.slice(0, 12).arrayBuffer();
        const webpArr = new Uint8Array(webpBuffer);
        if (webpArr[8] === 0x57 && webpArr[9] === 0x45 && webpArr[10] === 0x42 && webpArr[11] === 0x50) {
          return 'image/webp';
        }
      } catch (error) {
        console.error('Error detecting WebP format:', error);
      }
    }

    // 文档格式
    if (arr[0] === 0x25 && arr[1] === 0x50 && arr[2] === 0x44 && arr[3] === 0x46) {
      return 'application/pdf';
    }
    if (arr[0] === 0xD0 && arr[1] === 0xCF && arr[2] === 0x11 && arr[3] === 0xE0) {
      // 可能是 Microsoft Office 文档 (DOC, XLS, PPT)
      return 'application/vnd.ms-office';
    }

    // 压缩文件格式
    if (arr[0] === 0x50 && arr[1] === 0x4B && (arr[2] === 0x03 || arr[2] === 0x05 || arr[2] === 0x07)) {
      return 'application/zip';
    }
    if (arr[0] === 0x1F && arr[1] === 0x8B) {
      return 'application/gzip';
    }
    if (arr[0] === 0x52 && arr[1] === 0x61 && arr[2] === 0x72 && arr[3] === 0x21) {
      return 'application/x-rar-compressed';
    }
    if (arr[0] === 0x37 && arr[1] === 0x7A && arr[2] === 0xBC && arr[3] === 0xAF) {
      return 'application/x-7z-compressed';
    }
    if (arr[0] === 0x75 && arr[1] === 0x73 && arr[2] === 0x74 && arr[3] === 0x61) {
      return 'application/x-tar';
    }

    // 音频格式
    if (arr[0] === 0x49 && arr[1] === 0x44 && arr[2] === 0x33) {
      return 'audio/mpeg';
    }
    if (arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46) {
      // 可能是 WAV 或其他音频格式，需要进一步检查
      try {
        const riffBuffer = await file.slice(0, 12).arrayBuffer();
        const riffArr = new Uint8Array(riffBuffer);
        if (riffArr[8] === 0x57 && riffArr[9] === 0x41 && riffArr[10] === 0x56 && riffArr[11] === 0x45) {
          return 'audio/wav';
        }
      } catch (error) {
        console.error('Error detecting WAV format:', error);
      }
    }
    if (arr[0] === 0x4F && arr[1] === 0x67 && arr[2] === 0x67 && arr[3] === 0x53) {
      return 'audio/ogg';
    }
    if (arr[0] === 0x66 && arr[1] === 0x4C && arr[2] === 0x61 && arr[3] === 0x43) {
      return 'audio/flac';
    }

    // 视频格式
    if (arr[0] === 0x00 && arr[1] === 0x00 && arr[2] === 0x00 && arr[3] === 0x18) {
      return 'video/mp4';
    }
    if (arr[0] === 0x66 && arr[1] === 0x74 && arr[2] === 0x79 && arr[3] === 0x70) {
      return 'video/mp4';
    }
    if (arr[0] === 0x30 && arr[1] === 0x26 && arr[2] === 0xB2 && arr[3] === 0x75) {
      return 'video/wmv';
    }
    if (arr[0] === 0x00 && arr[1] === 0x00 && arr[2] === 0x00 && arr[3] === 0x14) {
      return 'video/mpeg';
    }

    // 可执行文件
    if (arr[0] === 0x7F && arr[1] === 0x45 && arr[2] === 0x4C && arr[3] === 0x46) {
      return 'application/x-elf-executable';
    }
    if (arr[0] === 0x4D && arr[1] === 0x5A) {
      return 'application/x-dosexec';
    }

    // 文本文件 (不太准确，但可以作为最后手段)
    if (arr[0] === 0xEF && arr[1] === 0xBB && arr[2] === 0xBF) {
      return 'text/plain; charset=utf-8';
    }
    if (arr[0] === 0xFE && arr[1] === 0xFF) {
      return 'text/plain; charset=utf-16be';
    }
    if (arr[0] === 0xFF && arr[1] === 0xFE) {
      return 'text/plain; charset=utf-16le';
    }

    // 如果无法识别，返回通用类型
    return 'application/octet-stream';
  } catch (error) {
    console.error('Error detecting MIME type from file content:', error);
    return 'application/octet-stream';
  }
};

export const extIsImage = (image) => /\.(bmp|jpe?g|png|gif|svg|webp|ico|tiff)$/i.test(image.filename);