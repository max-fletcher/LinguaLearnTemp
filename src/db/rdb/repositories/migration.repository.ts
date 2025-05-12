import { Sequelize } from 'sequelize';
import { UserClient } from '../../../db/clients/postgres.client';
import { seedAdminUsers } from '../seeders/admin-users.seeder';
import { seedAppUsers } from '../seeders/app-users.seeder';

export class MigrationRepository {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = UserClient.getInstance();
  }

  async testConnection() {
    await this.sequelize.authenticate();
  }

  async runMigration() {
    await this.sequelize.sync({ alter: true });
  }

  async refreshMigration() {
    await this.sequelize.sync({ force: true });
  }

  async seedAdminUser() {
    await seedAdminUsers();
  }

  async seedAppUser() {
    await seedAppUsers();
  }

  async dropColumns() {
    await this.sequelize.query('ALTER TABLE tiers DROP COLUMN stripe_product_id, DROP COLUMN stripe_price_id_single, DROP COLUMN stripe_price_id_recurring;')
    await this.sequelize.query('ALTER TABLE app_users DROP COLUMN square_customer_id;')
    await this.sequelize.query('ALTER TABLE transactions DROP COLUMN stripe_id;')
    await this.sequelize.query('ALTER TABLE user_tier_statuses DROP COLUMN stripe_id;')
  }
}
