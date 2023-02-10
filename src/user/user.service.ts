import { EmailService } from "./../email/email.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
const bcrypt = require("bcrypt");

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const { email } = userDto;
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new ConflictException("Email already in use");
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    await this.emailService.sendVerificationMail(userDto.email, userDto.name);
    return this.userRepository.save(newUser);
  }

  async getUsers(): Promise<CreateUserDto[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<CreateUserDto> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async findByEmail(email: string): Promise<CreateUserDto> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException("Email is required");
    }
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    var randomstring = Math.random().toString(36).slice(-8);
    await this.emailService.sendGeneratedPassword(
      email,
      randomstring,
      user.name
    );
    const hashedPassword = await bcrypt.hash(randomstring, 10);
    await this.userRepository.save({
      ...user,
      password: hashedPassword,
    });

    return { message: "Password send to email" };
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto
  ): Promise<void> {
    const user = await this.findById(id);

    const pwMatch = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!pwMatch) {
      throw new Error("Incorrect password");
    }

    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async activateUser(email: string) {
    return this.userRepository.update(
      { email },
      {
        isActive: true,
      }
    );
  }
}
