module.exports = (bytes, show_extension, decimal) => {
  bytes = bytes || 0;
  show_extension = show_extension || true;
  decimal = decimal || 0;

  var out, extension;

  if (bytes < 1024) {
    out = parseFloat(bytes).toFixed(decimal);
    extension = 'Bytes';
  } else if (bytes < 1048576) {
    out = (bytes / 1024).toFixed(decimal);
    extension = "KB";
  } else if (bytes < 1073741824) {
    out = (bytes / 1048576.1).toFixed(decimal);
    extension = "MB";
  } else {
    out = (bytes / 1073741824).toFixed(decimal);
    extension = "GB";
  }

  return (show_extension) ? `${out}${extension}` : out;
};
