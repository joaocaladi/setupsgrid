import { describe, it, expect } from "vitest";
import { cn, formatPrice, calculateTotalPrice, slugify } from "@/lib/utils";

describe("cn (className utility)", () => {
  it("should combine class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("should handle empty string", () => {
    expect(cn("foo", "", "bar")).toBe("foo bar");
  });
});

describe("formatPrice", () => {
  it("should format price in BRL currency", () => {
    const result = formatPrice(1500);
    expect(result).toContain("1.500");
    expect(result).toContain("R$");
  });

  it("should format decimal prices correctly", () => {
    const result = formatPrice(99.9);
    expect(result).toContain("99,90");
  });

  it("should return empty string for null", () => {
    expect(formatPrice(null)).toBe("");
  });

  it("should return empty string for undefined", () => {
    expect(formatPrice(undefined)).toBe("");
  });

  it("should format with different currency", () => {
    const result = formatPrice(100, "USD");
    expect(result).toContain("100");
    expect(result).toContain("US$");
  });

  it("should handle zero price", () => {
    const result = formatPrice(0);
    expect(result).toContain("0,00");
  });
});

describe("calculateTotalPrice", () => {
  it("should sum all product prices", () => {
    const products = [{ preco: 100 }, { preco: 200 }, { preco: 300 }];
    expect(calculateTotalPrice(products)).toBe(600);
  });

  it("should handle null prices as zero", () => {
    const products = [{ preco: 100 }, { preco: null }, { preco: 200 }];
    expect(calculateTotalPrice(products)).toBe(300);
  });

  it("should return 0 for empty array", () => {
    expect(calculateTotalPrice([])).toBe(0);
  });

  it("should handle all null prices", () => {
    const products = [{ preco: null }, { preco: null }];
    expect(calculateTotalPrice(products)).toBe(0);
  });

  it("should handle single product", () => {
    const products = [{ preco: 500 }];
    expect(calculateTotalPrice(products)).toBe(500);
  });
});

describe("slugify", () => {
  it("should convert text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("should remove accents", () => {
    expect(slugify("Configuração")).toBe("configuracao");
    expect(slugify("José María")).toBe("jose-maria");
  });

  it("should replace special characters with hyphens", () => {
    expect(slugify("Hello@World!")).toBe("hello-world");
  });

  it("should remove leading and trailing hyphens", () => {
    expect(slugify("--Hello World--")).toBe("hello-world");
  });

  it("should handle multiple spaces", () => {
    expect(slugify("Hello    World")).toBe("hello-world");
  });

  it("should handle Portuguese characters", () => {
    expect(slugify("São Paulo")).toBe("sao-paulo");
    expect(slugify("Ação")).toBe("acao");
  });

  it("should handle numbers", () => {
    expect(slugify("Setup 2024")).toBe("setup-2024");
  });

  it("should handle empty string", () => {
    expect(slugify("")).toBe("");
  });
});
