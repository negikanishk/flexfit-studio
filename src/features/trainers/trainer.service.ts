import { TrainerRepository } from "./trainer.repository";
import { CreateTrainerInput } from "./trainer.schemas";

export class TrainerService {
  static async getAllTrainers() {
    return TrainerRepository.findAll();
  }

  static async getTrainerById(id: string) {
    const trainer = await TrainerRepository.findById(id);
    if (!trainer) throw new Error(`Trainer ${id} not found`);
    return trainer;
  }

  static async registerTrainer(input: CreateTrainerInput) {
    return TrainerRepository.create(input);
  }
}
