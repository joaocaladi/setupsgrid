import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SetupCard } from "@/components/SetupCard";

// Mock data for SetupWithRelations
const mockSetup = {
  id: "setup-1",
  titulo: "Setup Minimalista",
  descricao: "Um setup clean e minimalista",
  imagemUrl: "https://example.com/setup.jpg",
  imagens: [],
  videoUrl: null,
  isVideo: false,
  autor: "João Silva",
  fonte: "Instagram",
  fonteUrl: "https://instagram.com/joao",
  destaque: false,
  visualizacoes: 100,
  createdAt: new Date(),
  updatedAt: new Date(),
  categorias: [
    { id: "cat-1", nome: "Minimalista", slug: "minimalista", descricao: null, cor: null, icone: null, ordem: 0 },
  ],
  produtos: [
    { id: "prod-1", nome: "Monitor", descricao: null, categoria: "Monitor", imagemUrl: null, preco: 1500, moeda: "BRL", linkCompra: null, loja: null, destaque: false, ordem: 0, setupId: "setup-1" },
    { id: "prod-2", nome: "Teclado", descricao: null, categoria: "Teclado", imagemUrl: null, preco: 500, moeda: "BRL", linkCompra: null, loja: null, destaque: false, ordem: 1, setupId: "setup-1" },
  ],
};

describe("SetupCard", () => {
  it("should render setup image", () => {
    render(<SetupCard setup={mockSetup} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", mockSetup.imagemUrl);
    expect(image).toHaveAttribute("alt", mockSetup.titulo);
  });

  it("should render setup title", () => {
    render(<SetupCard setup={mockSetup} />);
    expect(screen.getByText(mockSetup.titulo)).toBeInTheDocument();
  });

  it("should render author name", () => {
    render(<SetupCard setup={mockSetup} />);
    expect(screen.getByText(mockSetup.autor!)).toBeInTheDocument();
  });

  it("should render product count", () => {
    render(<SetupCard setup={mockSetup} />);
    expect(screen.getByText("2 produtos")).toBeInTheDocument();
  });

  it("should link to setup detail page", () => {
    render(<SetupCard setup={mockSetup} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/setup/${mockSetup.id}`);
  });

  it("should show video indicator when isVideo is true", () => {
    const videoSetup = { ...mockSetup, isVideo: true };
    render(<SetupCard setup={videoSetup} />);
    // The Play icon should be rendered - we can check for its container
    const container = document.querySelector(".bg-white\\/90");
    expect(container).toBeInTheDocument();
  });

  it("should not show video indicator when isVideo is false", () => {
    render(<SetupCard setup={mockSetup} />);
    const container = document.querySelector(".bg-white\\/90");
    expect(container).not.toBeInTheDocument();
  });

  it("should not render author when not provided", () => {
    const setupWithoutAuthor = { ...mockSetup, autor: null };
    render(<SetupCard setup={setupWithoutAuthor} />);
    expect(screen.queryByText("João Silva")).not.toBeInTheDocument();
  });

  it("should apply stagger animation class based on index", () => {
    render(<SetupCard setup={mockSetup} index={3} />);
    const card = document.querySelector(".stagger-4");
    expect(card).toBeInTheDocument();
  });
});
