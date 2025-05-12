import { MigrationRepository } from '../db/rdb/repositories/migration.repository';

export class MigrationService {
  private migrationRepository: MigrationRepository;

  constructor() {
    this.migrationRepository = new MigrationRepository();
  }

  async authentication() {
    await this.migrationRepository.testConnection();
  }

  async migrate() {
    await this.migrationRepository.runMigration();
  }

  async refreshMigration() {
    await this.migrationRepository.refreshMigration();
  }

  async seed() {
    await this.migrationRepository.seedAdminUser();
  }

  async seedAppUser() {
    await this.migrationRepository.seedAppUser();
  }

  async dropColumns() {
    await this.migrationRepository.dropColumns();
  }
}
