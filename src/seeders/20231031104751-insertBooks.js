"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      const fs = require("fs");
      const csv = require("csv-parser");
      const { Books, Publisher, Author, Genre } = require("../models");

      const csvFilePath = "./seeders/books.csv";
      const chunkSize = 50000;
      let totalRecords = 0;
      let recordsProcessed = 0;
      let chunk = [];
      let recordsToInsert = [];
      const uniqueGenres = [];
      const uniquePublishers = [];
      const uniqueAuthors = [];

      const processChunk = async () => {

        console.log(chunk);
        const tempChunk = [...chunk];
        chunk = [];
        const authorIdMap = new Map();
        const publisherIdMap = new Map();
        const genreIdMap = new Map();

        for (const row of tempChunk) {
          if (!uniqueGenres.includes(row.genre)) {
            uniqueGenres.push(row.genre);
          }

          if (!uniquePublishers.includes(row.publisher)) {
            uniquePublishers.push(row.publisher);
          }

          if (!uniqueAuthors.includes(row.author)) {
            uniqueAuthors.push(row.author);
          }
        }

        try {
          Promise.all([
            Author.findAll({
              attributes: ["id", "name"],
              where: { name: uniqueAuthors },
            }),
            Publisher.findAll({
              attributes: ["id", "name"],
              where: { name: uniquePublishers },
            }),
            Genre.findAll({
              attributes: ["id", "name"],
              where: { name: uniqueGenres },
            }),
          ])
          .then(([authors, publishers, genres])=>{
            authors.forEach((author) => {
              authorIdMap.set(author.name, author.id);
            });
          
            publishers.forEach((publisher) => {
              publisherIdMap.set(publisher.name, publisher.id);
            });
  
  
            genres.forEach((genre) => {
              genreIdMap.set(genre.name, genre.id);
            });
  
  
            for (const row of tempChunk) {
              const bookData = {
                title: row.title,
                genre_id: genreIdMap.get(row.genre),
                author_id: authorIdMap.get(row.author),
                publisher_id: publisherIdMap.get(row.publisher),
                publication_year: row.publication_year,
                ISBN: row.isbn,
              };
  
              recordsToInsert.push(bookData);
            }
  
            console.log('Data inserted in Array', recordsToInsert.length);
            queryInterface.bulkInsert("Books", recordsToInsert);
            console.log('Data Inserted', recordsToInsert.length);
  

          })
          .catch((error)=>{
            console.log('Error Fetching data from Models', error);
          })

          
          recordsToInsert = [];
          authorIdMap.clear();
          publisherIdMap.clear();
          genreIdMap.clear();
          uniqueAuthors.length = 0;
          uniquePublishers.length = 0;
          uniqueGenres.length = 0;
        } catch (error) {
          console.error("Error inserting books:", error);
          reject(error);
        }

        recordsProcessed += tempChunk.length;

        if (recordsProcessed < totalRecords) {
          console.log(`Processed ${recordsProcessed} records out of ${totalRecords}`);
        }
      };

      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", async (row) => {
          chunk.push(row);
          totalRecords++;

          if (chunk.length >= chunkSize) {
            await processChunk();
          }
        })
        .on("end", async () => {
          if (chunk.length > 0) {
            await processChunk();
          }

          console.log(
            `Total Records are: ${totalRecords} and inserted in table: ${recordsProcessed}`
          );
          console.log("CSV parsing completed.");
          console.log("Books data imported successfully.");
          resolve();
        })
        .on("error", (error) => {
          console.error("Error reading CSV file:", error);
          reject(error);
        });
    });
  },

  down: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      const { Books } = require("../models");

      try {
        await Books.destroy({ where: {} });

        console.log("Removed all records from the Books table.");
        resolve();
      } catch (error) {
        console.error("Error deleting Books records:", error);
        reject(error);
      }
    });
  },
};
