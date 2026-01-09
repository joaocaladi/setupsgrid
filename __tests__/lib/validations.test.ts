import { describe, it, expect } from "vitest";
import {
  produtoSchema,
  setupSchema,
  PRODUTO_CATEGORIAS,
  FONTES,
  LOJAS,
} from "@/lib/validations";

describe("produtoSchema", () => {
  it("should validate a valid product", () => {
    const validProduct = {
      nome: "Monitor LG",
      categoria: "Monitor",
      descricao: "Monitor 27 polegadas",
      preco: 1500,
      moeda: "BRL",
    };

    const result = produtoSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("should require nome with min 2 characters", () => {
    const invalidProduct = {
      nome: "A",
      categoria: "Monitor",
    };

    const result = produtoSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it("should require categoria", () => {
    const invalidProduct = {
      nome: "Monitor LG",
      categoria: "",
    };

    const result = produtoSchema.safeParse(invalidProduct);
    expect(result.success).toBe(false);
  });

  it("should allow optional fields", () => {
    const minimalProduct = {
      nome: "Monitor",
      categoria: "Monitor",
    };

    const result = produtoSchema.safeParse(minimalProduct);
    expect(result.success).toBe(true);
  });

  it("should validate URL for imagemUrl", () => {
    const product = {
      nome: "Monitor",
      categoria: "Monitor",
      imagemUrl: "not-a-url",
    };

    const result = produtoSchema.safeParse(product);
    expect(result.success).toBe(false);
  });

  it("should allow empty string for imagemUrl", () => {
    const product = {
      nome: "Monitor",
      categoria: "Monitor",
      imagemUrl: "",
    };

    const result = produtoSchema.safeParse(product);
    expect(result.success).toBe(true);
  });

  it("should validate positive price", () => {
    const product = {
      nome: "Monitor",
      categoria: "Monitor",
      preco: -100,
    };

    const result = produtoSchema.safeParse(product);
    expect(result.success).toBe(false);
  });

  it("should default moeda to BRL", () => {
    const product = {
      nome: "Monitor",
      categoria: "Monitor",
    };

    const result = produtoSchema.parse(product);
    expect(result.moeda).toBe("BRL");
  });

  it("should default destaque to false", () => {
    const product = {
      nome: "Monitor",
      categoria: "Monitor",
    };

    const result = produtoSchema.parse(product);
    expect(result.destaque).toBe(false);
  });
});

describe("setupSchema", () => {
  it("should validate a valid setup", () => {
    const validSetup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
    };

    const result = setupSchema.safeParse(validSetup);
    expect(result.success).toBe(true);
  });

  it("should require titulo with min 3 characters", () => {
    const invalidSetup = {
      titulo: "AB",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
    };

    const result = setupSchema.safeParse(invalidSetup);
    expect(result.success).toBe(false);
  });

  it("should require valid URL for imagemUrl", () => {
    const invalidSetup = {
      titulo: "Setup Gamer",
      imagemUrl: "not-a-url",
      categoriaIds: ["cat-1"],
    };

    const result = setupSchema.safeParse(invalidSetup);
    expect(result.success).toBe(false);
  });

  it("should require at least one category", () => {
    const invalidSetup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: [],
    };

    const result = setupSchema.safeParse(invalidSetup);
    expect(result.success).toBe(false);
  });

  it("should limit imagens array to 10", () => {
    const invalidSetup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
      imagens: Array(11).fill("https://example.com/image.jpg"),
    };

    const result = setupSchema.safeParse(invalidSetup);
    expect(result.success).toBe(false);
  });

  it("should default isVideo to false", () => {
    const setup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
    };

    const result = setupSchema.parse(setup);
    expect(result.isVideo).toBe(false);
  });

  it("should default destaque to false", () => {
    const setup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
    };

    const result = setupSchema.parse(setup);
    expect(result.destaque).toBe(false);
  });

  it("should default produtos to empty array", () => {
    const setup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
    };

    const result = setupSchema.parse(setup);
    expect(result.produtos).toEqual([]);
  });

  it("should validate nested produtos", () => {
    const setup = {
      titulo: "Setup Gamer",
      imagemUrl: "https://example.com/image.jpg",
      categoriaIds: ["cat-1"],
      produtos: [
        {
          nome: "A", // too short
          categoria: "Monitor",
        },
      ],
    };

    const result = setupSchema.safeParse(setup);
    expect(result.success).toBe(false);
  });
});

describe("Constants", () => {
  it("should have PRODUTO_CATEGORIAS defined", () => {
    expect(PRODUTO_CATEGORIAS).toBeDefined();
    expect(PRODUTO_CATEGORIAS.length).toBeGreaterThan(0);
    expect(PRODUTO_CATEGORIAS).toContain("Monitor");
    expect(PRODUTO_CATEGORIAS).toContain("Mesa");
    expect(PRODUTO_CATEGORIAS).toContain("Teclado");
  });

  it("should have FONTES defined", () => {
    expect(FONTES).toBeDefined();
    expect(FONTES.length).toBeGreaterThan(0);
    expect(FONTES).toContain("Instagram");
    expect(FONTES).toContain("Reddit");
  });

  it("should have LOJAS defined", () => {
    expect(LOJAS).toBeDefined();
    expect(LOJAS.length).toBeGreaterThan(0);
    expect(LOJAS).toContain("Amazon");
    expect(LOJAS).toContain("Kabum");
  });
});
