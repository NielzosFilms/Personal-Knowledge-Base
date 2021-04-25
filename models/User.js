module.exports = (sequelize, DataTypes) => {
  sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "compositeIndex",
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        private: true,
      },
    },
    {
      // Other model options go here
    }
  );
};
