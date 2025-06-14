import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    index: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    index: {
      name: 'user_email_idx',
      unique: true,
      using: 'BTREE'
    },
    get() {
      const rawValue = this.getDataValue('email');
      return rawValue ? rawValue.toLowerCase() : null;
    },
    set(value) {
      this.setDataValue('email', value ? value.toLowerCase() : null);
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('student', 'employer'),
    allowNull: false,
    index: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    }
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
    index: true
  },
  company_description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'user_role_company_idx',
      fields: ['role', 'company_name']
    },
    {
      name: 'user_search_idx',
      fields: ['bio', 'skills'],
      type: 'FULLTEXT'
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (user.email) {
        user.email = user.email.toLowerCase();
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (user.changed('email')) {
        user.email = user.email.toLowerCase();
      }
    }
  }
});

// Instance method to check password
User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User; 