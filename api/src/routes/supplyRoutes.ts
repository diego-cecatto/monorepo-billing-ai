// import { z } from "zod";
import { SefazService } from "./../services/sefazRSService";
import { router, publicProcedure } from "../config/rtpc";

export const supplyRouter = router({
  enter: publicProcedure
    // .input(z.object({ product: z.string() }))
    .query(async () =>
      // { input }
      {
        // const NFSKey = "4225 0155 4558 5000 0176 5500 1000 0027 8511 4749 9042";
        const NFSKey = "43250595323994000789550010001617671032958356";
        const sefasRSService = new SefazService();
        return await sefasRSService.getNFEByKey(NFSKey);
      },
    ),
});
