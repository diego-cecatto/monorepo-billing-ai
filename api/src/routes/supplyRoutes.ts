// import { z } from "zod";
import { SefasRSService } from "./../services/sefazRSService";
import { router, publicProcedure } from "../config/rtpc";

export const supplyRouter = router({
  enter: publicProcedure
    // .input(z.object({ product: z.string() }))
    .query(async () =>
      // { input }
      {
        const NFSKey = "4225 0155 4558 5000 0176 5500 1000 0027 8511 4749 9042";
        const sefasRSService = new SefasRSService();
        return await sefasRSService.getProducts(NFSKey);
      },
    ),
});
