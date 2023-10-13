import { describe, it, beforeAll } from "vitest";
import { errorDefaultExpects } from "./utils/errorDefaultExpects";
import { request } from "./setupFiles";

describe("delete book", () => {
   beforeAll(async () => {
      await request.post("/books").send({
         name: "Harry Potter",
         pages: 325,
         category: "fantasia",
      });
   });

   it("should throw error when the id is incorrect", () => {
      request.delete("/books/1").expect(204);
   });

   it("should throw error when the id is incorrect", async () => {
      const data = await request
         .delete("/books/2")
         .expect(404)
         .then((response) => response.body);

      errorDefaultExpects(data);
   });
});
