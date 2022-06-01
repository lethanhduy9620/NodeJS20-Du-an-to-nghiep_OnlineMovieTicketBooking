"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Films", [
      {
        id: 1,
        name: "It",
        genre: "Horror",
        poster: "/images/film/poster/it.jpg",
        trailer: "https://www.youtube.com/watch?v=FnCdOQsX5kc",
        rate: 7.3,
        length: 135,
        description:
          "Chú hề  ma quái  - IT hay còn gọi là IT: Chapter One là phim kinh dị Mỹ được ra mắt vào năm 2017, đạo diễn Andy Muschietti chịu trách nhiệm chỉ đạo, đây cũng là phần đầu tiên trong dự án phim It dựa trên nguyên tác của tiểu thuyết được viết bởi nhà văn Stephen King. Kịch bản phim được thực hiện bởi Chase Palmer, Cary Fukunaga và Gary Dauberman.",
        director: "Andrés Muschietti",
        actor: "Bill Skarsgård, Jaeden Martell, Jack Dylan Grazer",
        releaseDate: "2022-05-06",
        isReleased: true,
        coomingSoon: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        name: "Doctor Strange in the Multiverse of Madness",
        genre: "Action, Advanture, Fantasy",
        poster: "/images/film/poster/doctor_strange.jpg",
        trailer: "https://www.youtube.com/watch?v=aWzlQ2N6qqg",
        rate: 7.4,
        length: 126,
        description:
          "Sau các sự kiện của Avengers: Endgame, Tiến sĩ Stephen Strange tiếp tục nghiên cứu về Viên đá Thời gian. Nhưng một người bạn cũ đã trở thành kẻ thù tìm cách tiêu diệt mọi phù thủy trên Trái đất, làm xáo trộn kế hoạch của Strange và cũng khiến anh ta mở ra một tội ác khôn lường.",
        director: "Sam Raimi",
        actor: "Benedict Cumberbatch, Elizabeth Olsen Rachel McAdams",
        releaseDate: "2022-05-04",
        isReleased: true,
        coomingSoon: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        name: "Urban Myths",
        genre: "Horror",
        poster: "/images/film/poster/urban_myths.jpg",
        trailer: "https://www.youtube.com/watch?v=rENXd4Eq5rw",
        rate: 6.5,
        length: 122,
        description:
          "Những câu chuyện ma đáng sợ nhất của đô thị Seoul Hàn Quốc! Tác phẩm gồm 10 câu chuyện ma có nội dung độc lập nhưng đều lấy bối cảnh ở thủ đô Seoul thời hiện đại.",
        director: "Hong Won Ki",
        actor: "Shownu, Lee Min Hyuk, Arin",
        releaseDate: "2022-05-14",
        isReleased: true,
        coomingSoon: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Films", null, {});
  },
};
