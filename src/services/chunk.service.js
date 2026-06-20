function splitText(
  text,
  chunkSize = 3000
) {
  const chunks = [];

  for (
    let i = 0;
    i < text.length;
    i += chunkSize
  ) {
    chunks.push(
      text.slice(i, i + chunkSize)
    );
  }

  return chunks;
}

module.exports = {
  splitText,
};