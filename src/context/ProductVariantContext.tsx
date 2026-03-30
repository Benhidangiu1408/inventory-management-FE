"use client";

import { ProductVariantResponse } from "@/interfaces/inboundOutboundType";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface ProducttVariantContextType {
  productVariants: ProductVariantResponse[] | null;
  setProductVariants: React.Dispatch<
    React.SetStateAction<ProductVariantResponse[] | null>
  >;
}

const ProductVariantContext = createContext<
  ProducttVariantContextType | undefined
>(undefined);

export function ProductVariantProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: ProductVariantResponse[] | null;
}) {
  const [productVariants, setProductVariants] = useState(initialData);

  useEffect(() => {
    setProductVariants(initialData);
  }, [initialData]);

  return (
    <ProductVariantContext.Provider
      value={{ productVariants, setProductVariants }}
    >
      {children}
    </ProductVariantContext.Provider>
  );
}

export function useProductVariant() {
  const context = useContext(ProductVariantContext);

  if (!context) {
    throw new Error(
      "useProductVariant must be used inside ProductVariantContextProvider",
    );
  }

  return context;
}
