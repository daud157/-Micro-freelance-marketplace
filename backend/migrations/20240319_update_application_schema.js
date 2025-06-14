import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  // Add feedback column if it doesn't exist
  try {
    await queryInterface.addColumn('applications', 'feedback', {
      type: DataTypes.TEXT,
      allowNull: true
    });
  } catch (error) {
    console.log('Column feedback might already exist');
  }

  // Rename application_date to created_at if it exists
  try {
    await queryInterface.renameColumn('applications', 'application_date', 'created_at');
  } catch (error) {
    console.log('Column application_date might not exist');
  }
}

export async function down(queryInterface) {
  // Remove feedback column
  try {
    await queryInterface.removeColumn('applications', 'feedback');
  } catch (error) {
    console.log('Column feedback might not exist');
  }

  // Rename created_at back to application_date
  try {
    await queryInterface.renameColumn('applications', 'created_at', 'application_date');
  } catch (error) {
    console.log('Column created_at might not exist');
  }
} 