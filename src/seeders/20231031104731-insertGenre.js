'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      const fs = require('fs');
      const csv = require('csv-parser');
      const { Genre } = require('../models');

      const csvFilePath = './seeders/genre.csv';

      let totalRecords = 0;
      let recordsProcessed = 0;

      fs.createReadStream(csvFilePath).pipe(csv())
      .on('data',async (row) => {
        try {
          totalRecords++;
            const genreData = {
              name: row.name,
            };
            await Genre.create(genreData);

          recordsProcessed++;

          if (recordsProcessed === totalRecords) {
            console.log(`Total Records are: ${totalRecords} and inserted in table: ${recordsProcessed}`);
            console.log('CSV parsing completed.');
            console.log('Genre data imported successfully.');
            resolve();
          }
        } catch (error) {
          console.error('Error inserting genre:', error);
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
      const { Genre } = require('../models');
  
      try {
        await Genre.destroy({ where: {} });
        console.log('Removed all records from the Genre table.');
        resolve();
      } catch (error) {
        console.error('Error deleting Genre records:', error);
        reject(error);
      }
    });
  }  
};
