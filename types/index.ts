import type {
  Setup,
  Categoria,
  Produto,
  SetupSubmission,
  SetupSubmissionImage,
  SetupSubmissionProduct,
  ProductLinkCheck,
  LinkStatus,
  Profile,
} from "@prisma/client";

// Types com relações incluídas
export type SetupWithRelations = Setup & {
  categorias: Categoria[];
  produtos: Produto[];
};

export type CategoriaWithSetups = Categoria & {
  setups: Setup[];
};

export type SubmissionWithRelations = SetupSubmission & {
  images: SetupSubmissionImage[];
  products: SetupSubmissionProduct[];
};

export type ProdutoWithLinkChecks = Produto & {
  linkChecks: ProductLinkCheck[];
};

// Profile types
export type ProfileWithSetups = Profile & {
  setups: SetupWithRelations[];
};

export type SetupWithUser = SetupWithRelations & {
  user: Profile | null;
};

// Re-export dos tipos base do Prisma
export type {
  Setup,
  Categoria,
  Produto,
  SetupSubmission,
  SetupSubmissionImage,
  SetupSubmissionProduct,
  ProductLinkCheck,
  LinkStatus,
  Profile,
};
