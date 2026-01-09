import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CategoryBadge } from "@/components/CategoryBadge";

describe("CategoryBadge", () => {
  it("should render category name", () => {
    render(<CategoryBadge nome="Gaming" slug="gaming" />);
    expect(screen.getByText("Gaming")).toBeInTheDocument();
  });

  it("should render as link when clickable (default)", () => {
    render(<CategoryBadge nome="Gaming" slug="gaming" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/categoria/gaming");
  });

  it("should not render as link when clickable is false", () => {
    render(<CategoryBadge nome="Gaming" slug="gaming" clickable={false} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Gaming")).toBeInTheDocument();
  });

  it("should apply small size classes by default", () => {
    render(<CategoryBadge nome="Gaming" slug="gaming" clickable={false} />);
    const badge = screen.getByText("Gaming");
    expect(badge).toHaveClass("px-3", "py-1", "text-[11px]");
  });

  it("should apply medium size classes when size is md", () => {
    render(
      <CategoryBadge nome="Gaming" slug="gaming" size="md" clickable={false} />
    );
    const badge = screen.getByText("Gaming");
    expect(badge).toHaveClass("px-4", "py-1.5", "text-[13px]");
  });

  it("should have hover styles when clickable", () => {
    render(<CategoryBadge nome="Gaming" slug="gaming" clickable={true} />);
    const badge = screen.getByText("Gaming");
    expect(badge.className).toContain("hover:");
  });
});
