import { mockUsersApi } from "../mock-api"
import type { User } from "../types"

export async function getUsers(): Promise<User[]> {
  return mockUsersApi.getAll()
}

export async function getUserById(id: string): Promise<User> {
  return mockUsersApi.getById(id)
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  return mockUsersApi.create(data)
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return mockUsersApi.update(id, data)
}

export async function deleteUser(id: string): Promise<void> {
  return mockUsersApi.delete(id)
}
