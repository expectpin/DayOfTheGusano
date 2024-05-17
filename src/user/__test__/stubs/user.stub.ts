import { User } from "../../entity/user.entity";
import { Role } from "../../role.enun";

export const userStub: User = {
  id: 1,
  name: "Unit",
  lastName: "Test",
  email: "test@test.com",
  password: "somepass",
  role: Role.User,
  createdAt: null,
  updatedAt: null,
  isActive: true,
  isDeleted: false,
};

export const usersStub: User[] = [
  {
    id: 1,
    name: "Unit",
    lastName: "Test",
    email: "test@test.com",
    password: "somepass",
    role: Role.User,
    createdAt: null,
    updatedAt: null,
    isActive: true,
    isDeleted: false,
  },
  {
    id: 2,
    name: "Unit2",
    lastName: "Test2",
    email: "test@test.com",
    password: "somepass",
    role: Role.User,
    createdAt: null,
    updatedAt: null,
    isActive: true,
    isDeleted: false,
  },
];
