"use server";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@/lib/categories/validations";
import { slugify } from "@/lib/categories/utils";

type CategoryFieldErrors = Partial<
  Record<
    "id" | "name" | "slug" | "description" | "displayOrder" | "isActive" | "isVisible",
    string[]
  >
>;

export type CategoryActionState = {
  success?: string;
  error?: string;
  fieldErrors?: CategoryFieldErrors;
};

async function generateUniqueSlug(slug: string, currentCategoryId?: string) {
  let finalSlug = slug;
  let counter = 1;

  while (true) {
    const existingCategory = await prisma.category.findUnique({
      where: { slug: finalSlug },
    });

    if (!existingCategory || existingCategory.id === currentCategoryId) {
      return finalSlug;
    }

    finalSlug = `${slug}-${counter}`;
    counter++;
  }
}

async function uploadCategoryImage(file: File | null): Promise<string | null> {
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
  const uploadDir = join(process.cwd(), "public", "uploads", "categories");
  const filePath = join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/categories/${fileName}`;
}

export async function createCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  await requireSuperAdmin();

  const rawData = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    displayOrder: String(formData.get("displayOrder") ?? "0"),
    isActive: formData.get("isActive") === "on",
    isVisible: formData.get("isVisible") === "on",
  };

  const validation = createCategorySchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const { name, description, displayOrder, isActive, isVisible } =
      validation.data;

    const baseSlug = validation.data.slug
      ? slugify(validation.data.slug)
      : slugify(name);

    if (!baseSlug) {
      return {
        error: "Le slug généré est invalide. Vérifiez le nom de la catégorie.",
      };
    }

    const finalSlug = await generateUniqueSlug(baseSlug);

    const image = formData.get("image");
    const imageUrl = await uploadCategoryImage(
      image instanceof File ? image : null
    );

    await prisma.category.create({
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        displayOrder,
        isActive,
        isVisible,
        imageUrl,
      },
    });

    revalidatePath("/categories");

    return {
      success: "Catégorie ajoutée avec succès.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l'ajout.",
    };
  }
}

export async function updateCategoryAction(
  _previousState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  await requireSuperAdmin();

  const rawData = {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    displayOrder: String(formData.get("displayOrder") ?? "0"),
    isActive: formData.get("isActive") === "on",
    isVisible: formData.get("isVisible") === "on",
  };

  const validation = updateCategorySchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, name, description, displayOrder, isActive, isVisible } =
      validation.data;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return {
        error: "Catégorie introuvable.",
      };
    }

    const baseSlug = validation.data.slug
      ? slugify(validation.data.slug)
      : slugify(name);

    if (!baseSlug) {
      return {
        error: "Le slug généré est invalide. Vérifiez le nom de la catégorie.",
      };
    }

    const finalSlug = await generateUniqueSlug(baseSlug, id);

    const image = formData.get("image");
    const uploadedImageUrl = await uploadCategoryImage(
      image instanceof File ? image : null
    );

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: finalSlug,
        description: description || null,
        displayOrder,
        isActive,
        isVisible,
        imageUrl: uploadedImageUrl ?? existingCategory.imageUrl,
      },
    });

    revalidatePath("/categories");

    return {
      success: "Catégorie modifiée avec succès.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant la modification.",
    };
  }
}

export async function deleteCategoryAction(formData: FormData): Promise<void> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!category) {
    return;
  }

  if (category._count.products > 0) {
    await prisma.category.update({
      where: { id },
      data: {
        isActive: false,
        isVisible: false,
        isArchived: true,
      },
    });
  } else {
    await prisma.category.delete({
      where: { id },
    });
  }

  revalidatePath("/categories");
}