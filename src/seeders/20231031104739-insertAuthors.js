'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return new Promise(async (resolve, reject) => {
      const fs = require('fs');
      const csv = require('csv-parser');
      const { Author } = require('../models');

      const csvFilePath = './seeders/authors.csv';

      let totalRecords = 0;
      let recordsProcessed = 0;

      fs.createReadStream(csvFilePath).pipe(csv())
        .on('data', async (row) => {
          try {
            totalRecords++;
            const authorsData = {
              name: row.name,
              birth_date: row.birth_date,
              country: row.country,
              biography: row.biography
            };

            await Author.create(authorsData);

            recordsProcessed++;

            if (recordsProcessed === totalRecords) {
              console.log(`Total Records are: ${totalRecords} and inserted in table: ${recordsProcessed}`);
              console.log('CSV parsing completed.');
              console.log('Authors data imported successfully.');
              resolve();
            }
          } catch (error) {
            console.error('Error inserting authors:', error);
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
      const { Author } = require('../models');

      try {
        await Author.destroy({ where: {} });

        console.log('Removed all records from the Authors table.');
        resolve();
      } catch (error) {
        console.error('Error deleting Authors records:', error);
        reject(error);
      }
    });
  }
};
