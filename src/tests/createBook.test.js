import { describe, it, expect, beforeAll } from "vitest";
import { resetDatabase } from "../database/database";
import { bookDefaultExpects } from "./utils/bookDefaultExpects";
import { errorDefaultExpects } from "./utils/errorDefaultExpects";
import { request } from "./setupFiles";

describe("create book", () => {
   beforeAll(() => {
      resetDatabase();
   });

   it("should be able to create a book sucessfully", async () => {
      const data = await request
         .post("/books")
         .send({
            name: "Harry Potter",
            pages: 325,
            category: "fantasia",
         })
         .expect(201)
         .then((response) => response.body);

      bookDefaultExpects(data);

      expect(data.category).toBeDefined();
      expect(data.category).toBeTypeOf("string");
   });

   it("should be able to create a book without a category", async () => {
      const data = await request
         .post("/books")
         .send({
            name: "Jogos Vorazes",
            pages: 225,
         })
         .expect(201)
         .then((response) => response.body);

      bookDefaultExpects(data);

      expect(data.category).toBeUndefined();
   });

   it("should not be able to create a book with the same name", async () => {
      const data = await request
         .post("/books")
         .send({
            name: "Jogos Vorazes",
            pages: 225,
         })
         .expect(409)
         .then((response) => response.body);

      errorDefaultExpects(data);
   });

   it("should throw error when there is a missing body parameter", async () => {
      const data = await request
         .post("/books")
         .send({
            category: "Example"
         })
         .expect(409)
         .then((response) => response.body);

      expect(data.issues).toHaveLength(2);

      expect(data.issues[0]).toBeTypeOf("object");   
      expect(data.issues[0].message).toBe("Required"); 

      expect(data.issues[1]).toBeTypeOf("object");   
      expect(data.issues[1].message).toBe("Required"); 
   })

   it("should throw error when some invalid value type are sent", async () => {
      const data = await request
         .post("/books")
         .send({
            name: 123,
            pages: "Otavio",
            category: "Example"
         })
         .expect(409)
         .then((response) => response.body);

      expect(data.issues).toHaveLength(2);
      
      expect(data.issues[0]).toBeTypeOf("object");   
      expect(data.issues[0].message).toBe("Expected string, received number"); 

      expect(data.issues[1]).toBeTypeOf("object");   
      expect(data.issues[1].message).toBe("Expected number, received string"); 
   })
});
