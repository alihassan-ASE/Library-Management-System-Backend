'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      const fs = require('fs');
      const csv = require('csv-parser');
      const { Publisher, Genre } = require('../models');

      const csvFilePath = './seeders/publishers.csv';

      let totalRecords = 0;
      let recordsProcessed = 0;

      fs.createReadStream(csvFilePath).pipe(csv())
      .on('data',async (row) => {
        try {
          totalRecords++;
          const genre = await Genre.findOne({
            where: { name: row.genre_speciality },
          });

          if (genre) {
            const publisherData = {
              name: row.name,
              genre_id: genre.id,
              founded_date: row.founded_date,
              city: row.city,
              country: row.country,
            };
            await Publisher.create(publisherData);
          } else {
            console.log(`Genre '${row.genre_speciality}' not found in Genre table.`);
          }

          recordsProcessed++;

          if (recordsProcessed === totalRecords) {
            console.log(`Total Records are: ${totalRecords} and inserted in table: ${recordsProcessed}`);
            console.log('CSV parsing completed.');
            console.log('Publisher data imported successfully.');
            resolve();
          }
        } catch (error) {
          console.error('Error inserting publisher:', error);
          reject(error);
        }
      });

      fs.createReadStream(csvFilePath).pipe(csv()).on('end', () => {
        resolve();
      });

      fs.createReadStream(csvFilePath).pipe(csv()).on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      const { Publisher } = require('../models');
  
      try {
        await Publisher.destroy({ where: {} });
  
        console.log('Removed all records from the Publisher table.');
        resolve();
      } catch (error) {
        console.error('Error deleting Publisher records:', error);
        reject(error);
      }
    });
  }  
};
