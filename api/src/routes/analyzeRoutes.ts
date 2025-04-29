// import { z } from "zod";
import { router, publicProcedure } from "../config/rtpc";
import { analyzeComposition } from "../services/analyzeService";

export const analyzeRouter = router({
  composition: publicProcedure
    // .input(z.object({ product: z.string() }))
    .query(async () =>
      // { input }
      {
        //return await analyzeComposition(input.product);
        return await analyzeComposition();
      },
    ),
});
