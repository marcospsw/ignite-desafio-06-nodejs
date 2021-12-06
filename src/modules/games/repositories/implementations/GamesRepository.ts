import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
      .createQueryBuilder("game")
      .where("game.title ilike :title", { title: `%${param}%` })
      .getMany();

    if (!games) {
      throw new Error("Jogos não encontrados");
    }

    return games;
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`SELECT COUNT(id) FROM games`); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = this.repository
      .createQueryBuilder("game")
      .innerJoinAndSelect("game.users", "user")
      .where("game.id = :id", { id })
      .getOne();

    if (!game) {
      throw new Error("Jogo não encontrado");
    }

    const gameUsers = game as Promise<Game>;

    return (await gameUsers).users;
    // Complete usando query builder
  }
}
