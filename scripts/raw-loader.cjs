module.exports = function rawLoader(source) {
  const json = JSON.stringify(source);
  return `export default ${json};`;
};
