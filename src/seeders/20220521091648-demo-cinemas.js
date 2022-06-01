"use strict";

const cinemaData = [
  {
    id: 1,
    cinemaCode: "cgv-pearl-plaza",
    name: "CGV Pearl Plaza",
    address:
      "Tầng 5, Pearl Plaza, 561A Điện Biên Phủ, P.25, Quận Bình Thạnh, TP. Hồ Chí Minh",
    cinemaChainId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    cinemaCode: "cgv-cresent-mall",
    name: "CGV Crescent Mall",
    address:
      "Lầu 5, Crescent Mall Đại lộ Nguyễn Văn Linh, Phú Mỹ Hưng Quận 7 TP. Hồ Chí Minh",
    cinemaChainId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    cinemaCode: "galaxy-tan-binh",
    name: "Galaxy Tân Bình",
    address: "246 Nguyễn Hồng Đào, Quận Tân Bình, TP. Hồ Chí Minh",
    cinemaChainId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    cinemaCode: "galaxy-kinh-duong-vuong",
    name: "Galaxy Kinh Dương Vương",
    address: "718bis Kinh Dương Vương, Quận 6, TP. Hồ Chí Minh",
    cinemaChainId: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const getIndex = (key, queryCinemaChainRow) => {
  return queryCinemaChainRow.findIndex(
    (cinemaChain) => cinemaChain.chainCode === key
  );
};

module.exports = {
  async up(queryInterface, Sequelize) {
    //Query id from cinemachains table to inset into cinema table
    const cinemaChainsQuery = await queryInterface.sequelize.query(
      `SELECT id, chainCode FROM cinemachains;`
    );
    //return [[ { id: 1, chainCode: 'cgv' }, { id: 2, chainCode: 'galaxy' } ],[ { id: 1, chainCode: 'cgv' }, { id: 2, chainCode: 'galaxy' } ]]

    const cinemaChainsRow = cinemaChainsQuery[0];

    cinemaData.forEach((cinema) => {
      const index = getIndex(cinema.cinemaCode.split("-")[0], cinemaChainsRow);
      cinema.cinemaChainId = cinemaChainsRow[index].id;
    });

    return queryInterface.bulkInsert("Cinemas", cinemaData);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Cinemas", null, {});
  },
};
