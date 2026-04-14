import { AppDataSource } from "../database/data-source";
import { User } from "../database/entities/User";
import { Repository } from "typeorm";

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = AppDataSource.getRepository(User);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return await this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  // ← novo: buscar pelo token de verificação
  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { verificationToken: token },
    });
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, userData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find({
      where: { isActive: true },
      select: ["id", "name", "email", "avatar", "createdAt", "updatedAt"],
    });
  }
}