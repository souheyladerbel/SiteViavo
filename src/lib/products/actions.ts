"use server";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/products/validations";
import { parsePriceToMillimes, slugify } from "@/lib/products/utils";

type ProductFieldErrors = Partial<
  Record<
    | "id"
    | "name"
    | "slug"
    | "description"
    | "price"
    | "stock"
    | "categoryId"
    | "videoUrl"
    | "isVisible"
    | "isBestSeller"
    | "isPromotion",
    string[]
  >
>;

export type ProductActionState = {
  success?: string;
  error?: string;
  fieldErrors?: ProductFieldErrors;
};

async function generateUniqueProductSlug(slug: string, currentProductId?: string) {
  let finalSlug = slug;
  let counter = 1;

  while (true) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: finalSlug },
    });

    if (!existingProduct || existingProduct.id === currentProductId) {
      return finalSlug;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }
}

async function uploadImage(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format image invalide. Utilisez JPG, PNG ou WEBP.");
  }

  const maxSize = 2 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error("L'image ne doit pas dépasser 2 Mo.");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = join(process.cwd(), "public", "uploads", "products");
  const filePath = join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/products/${fileName}`;
}

async function validateCategory(categoryId: string) {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("La catégorie sélectionnée est introuvable.");
  }

  if (category.isArchived) {
    throw new Error("Impossible d’associer un produit à une catégorie archivée.");
  }

  return category;
}

export async function createProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireSuperAdmin();

  const rawData = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    stock: String(formData.get("stock") ?? "0"),
    categoryId: String(formData.get("categoryId") ?? ""),
    videoUrl: String(formData.get("videoUrl") ?? ""),
    isVisible: formData.get("isVisible") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isPromotion: formData.get("isPromotion") === "on",
  };

  const validation = createProductSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
      videoUrl,
      isVisible,
      isBestSeller,
      isPromotion,
    } = validation.data;

    await validateCategory(categoryId);

    const baseSlug = validation.data.slug
      ? slugify(validation.data.slug)
      : slugify(name);

    if (!baseSlug) {
      return {
        error: "Le slug généré est invalide. Vérifiez le nom du produit.",
      };
    }

    const finalSlug = await generateUniqueProductSlug(baseSlug);

    const mainImage = formData.get("mainImage");
    const mainImageUrl = await uploadImage(
      mainImage instanceof File ? mainImage : null
    );

    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        priceInCents: parsePriceToMillimes(price),
        stock,
        categoryId,
        videoUrl: videoUrl || null,
        mainImageUrl,
        isVisible,
        isBestSeller,
        isPromotion,
      },
    });

    const secondaryImages = formData.getAll("secondaryImages");

    for (let index = 0; index < secondaryImages.length; index++) {
      const image = secondaryImages[index];
      const imageUrl = await uploadImage(image instanceof File ? image : null);

      if (imageUrl) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: imageUrl,
            displayOrder: index,
          },
        });
      }
    }

    revalidatePath("/products");

    return {
      success: "Produit ajouté avec succès.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'ajout du produit.",
    };
  }
}

export async function updateProductAction(
  _previousState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  await requireSuperAdmin();

  const rawData = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    stock: String(formData.get("stock") ?? "0"),
    categoryId: String(formData.get("categoryId") ?? ""),
    videoUrl: String(formData.get("videoUrl") ?? ""),
    isVisible: formData.get("isVisible") === "on",
    isBestSeller: formData.get("isBestSeller") === "on",
    isPromotion: formData.get("isPromotion") === "on",
  };

  const validation = updateProductSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const {
      id,
      name,
      description,
      price,
      stock,
      categoryId,
      videoUrl,
      isVisible,
      isBestSeller,
      isPromotion,
    } = validation.data;

    await validateCategory(categoryId);

    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return {
        error: "Produit introuvable.",
      };
    }

    const baseSlug = validation.data.slug
      ? slugify(validation.data.slug)
      : slugify(name);

    const finalSlug = await generateUniqueProductSlug(baseSlug, id);

    const mainImage = formData.get("mainImage");
    const uploadedMainImageUrl = await uploadImage(
      mainImage instanceof File ? mainImage : null
    );

    await prisma.product.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        priceInMillimes: parsePriceToMillimes(price),
        stock,
        categoryId,
        videoUrl: videoUrl || null,
        mainImageUrl: uploadedMainImageUrl ?? existingProduct.mainImageUrl,
        isVisible,
        isBestSeller,
        isPromotion,
      },
    });

    const secondaryImages = formData.getAll("secondaryImages");

    for (let index = 0; index < secondaryImages.length; index++) {
      const image = secondaryImages[index];
      const imageUrl = await uploadImage(image instanceof File ? image : null);

      if (imageUrl) {
        await prisma.productImage.create({
          data: {
            productId: id,
            url: imageUrl,
            displayOrder: index,
          },
        });
      }
    }

    revalidatePath("/products");

    return {
      success: "Produit modifié avec succès.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la modification du produit.",
    };
  }
}

export async function archiveOrDeleteProductAction(
  formData: FormData
): Promise<void> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          orderItems: true,
        },
      },
    },
  });

  if (!product) {
    return;
  }

  if (product._count.orderItems > 0) {
    await prisma.product.update({
      where: { id },
      data: {
        isVisible: false,
        isArchived: true,
      },
    });
  } else {
    await prisma.product.delete({
      where: { id },
    });
  }

  revalidatePath("/products");
}