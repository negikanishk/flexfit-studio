import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TrainerService } from "@/features/trainers/trainer.service";
import { createTrainerSchema } from "@/features/trainers/trainer.schemas";

export const trainersRouter = router({
  list: publicProcedure.query(async () => {
    return TrainerService.getAllTrainers();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return TrainerService.getTrainerById(input.id);
    }),

  create: publicProcedure
    .input(createTrainerSchema)
    .mutation(async ({ input }) => {
      return TrainerService.registerTrainer(input);
    }),
});
