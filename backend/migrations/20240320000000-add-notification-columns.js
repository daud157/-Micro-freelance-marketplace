import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.addColumn('Notifications', 'employer_id', {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  });

  await queryInterface.addColumn('Notifications', 'application_id', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Applications',
      key: 'id'
    }
  });

  await queryInterface.addColumn('Notifications', 'project_id', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Projects',
      key: 'id'
    }
  });

  await queryInterface.addColumn('Notifications', 'student_id', {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  });
}

export async function down(queryInterface) {
  await queryInterface.removeColumn('Notifications', 'employer_id');
  await queryInterface.removeColumn('Notifications', 'application_id');
  await queryInterface.removeColumn('Notifications', 'project_id');
  await queryInterface.removeColumn('Notifications', 'student_id');
} 