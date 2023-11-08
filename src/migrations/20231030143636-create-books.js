'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      genre_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Genre',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Author',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      publisher_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Publisher',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      publication_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ISBN: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    },
    {
      timestamps: false
    });

    // Indexing
    await queryInterface.addIndex('Books', ['title']);
    await queryInterface.addIndex('Books', ['genre_id']);
    await queryInterface.addIndex('Books', ['author_id']);
    await queryInterface.addIndex('Books', ['publisher_id']);
    await queryInterface.addIndex('Books', ['ISBN']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');
  }
};
