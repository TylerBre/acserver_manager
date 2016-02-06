// dlc in the literal sense: "Downloadable Content"
// it's assumed that all "dlc" will be unofficial, this is for content that
// users add, and is used to track the source of installed content, and
// the status of downloads/installations/errors

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('dlc', {
    socket_id: DataTypes.INTEGER,
    url: DataTypes.STRING,
    install_log: DataTypes.ARRAY(DataTypes.TEXT),
    status: {
      type: DataTypes.ENUM('errored', 'installed', 'processing'),
      defaultValue: 'processing'
    },
    lifecycle: {
      type: DataTypes.ENUM('downloading', 'extracting', 'installing', 'registering', 'done'),
      defaultValue: 'downloading'
    }
  }, {});
};