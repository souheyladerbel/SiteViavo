"use server";

import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth/guards";
import {
  bestSellerSchema,
  carouselImageSchema,
  updateBestSellerOrderSchema,
  updateCarouselImageSchema,
  updateSiteSettingsSchema,
} from "@/lib/settings/validations";

export type SettingsActionState = {
  success?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

async function uploadSiteImage(
  file: File | null,
  folder: "logo" | "carousel",
  maxSizeInMb: number
): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format image invalide. Utilisez JPG, PNG ou WEBP.");
  }

  const maxSize = maxSizeInMb * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(`L’image ne doit pas dépasser ${maxSizeInMb} Mo.`);
  }

  const extension = file.name.split(".").pop() || "jpg";
  const fileName = `${randomUUID()}.${extension}`;
  const uploadDir = join(process.cwd(), "public", "uploads", folder);
  const filePath = join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/${folder}/${fileName}`;
}

export async function updateSiteSettingsAction(
  _previousState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireSuperAdmin();

  const rawData = {
    themeMode: String(formData.get("themeMode") ?? "LIGHT"),
    primaryColor: String(formData.get("primaryColor") ?? ""),
    secondaryColor: String(formData.get("secondaryColor") ?? ""),
    homeHeroTitle: String(formData.get("homeHeroTitle") ?? ""),
    homeHeroSubtitle: String(formData.get("homeHeroSubtitle") ?? ""),
    homeCtaText: String(formData.get("homeCtaText") ?? ""),
    homeCtaHref: String(formData.get("homeCtaHref") ?? ""),
  };

  const validation = updateSiteSettingsSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const logo = formData.get("logo");
    const uploadedLogoUrl = await uploadSiteImage(
      logo instanceof File ? logo : null,
      "logo",
      1
    );

    const existingSettings = await prisma.siteSetting.findUnique({
      where: {
        id: "site-settings",
      },
    });

    await prisma.siteSetting.upsert({
      where: {
        id: "site-settings",
      },
      update: {
        ...validation.data,
        logoUrl: uploadedLogoUrl ?? existingSettings?.logoUrl ?? null,
      },
      create: {
        id: "site-settings",
        ...validation.data,
        logoUrl: uploadedLogoUrl,
      },
    });

    revalidatePath("/settings");

    return {
      success: "Paramètres du site modifiés avec succès.",
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

export async function createCarouselImageAction(
  _previousState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireSuperAdmin();

  const rawData = {
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    displayOrder: String(formData.get("displayOrder") ?? "0"),
    isActive: formData.get("isActive") === "on",
  };

  const validation = carouselImageSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const image = formData.get("image");

    const imageUrl = await uploadSiteImage(
      image instanceof File ? image : null,
      "carousel",
      3
    );

    if (!imageUrl) {
      return {
        error: "L’image du carrousel est obligatoire.",
      };
    }

    await prisma.carouselImage.create({
      data: {
        imageUrl,
        title: validation.data.title || null,
        subtitle: validation.data.subtitle || null,
        altText: validation.data.altText || null,
        displayOrder: validation.data.displayOrder,
        isActive: validation.data.isActive,
      },
    });

    revalidatePath("/settings");

    return {
      success: "Image ajoutée au carrousel.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue pendant l’ajout de l’image.",
    };
  }
}

export async function updateCarouselImageAction(
  formData: FormData
): Promise<void> {
  await requireSuperAdmin();

  const rawData = {
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    altText: String(formData.get("altText") ?? ""),
    displayOrder: String(formData.get("displayOrder") ?? "0"),
    isActive: formData.get("isActive") === "on",
  };

  const validation = updateCarouselImageSchema.safeParse(rawData);

  if (!validation.success) {
    return;
  }

  const existingImage = await prisma.carouselImage.findUnique({
    where: {
      id: validation.data.id,
    },
  });

  if (!existingImage) {
    return;
  }

  const image = formData.get("image");
  const uploadedImageUrl = await uploadSiteImage(
    image instanceof File ? image : null,
    "carousel",
    3
  );

  await prisma.carouselImage.update({
    where: {
      id: validation.data.id,
    },
    data: {
      imageUrl: uploadedImageUrl ?? existingImage.imageUrl,
      title: validation.data.title || null,
      subtitle: validation.data.subtitle || null,
      altText: validation.data.altText || null,
      displayOrder: validation.data.displayOrder,
      isActive: validation.data.isActive,
    },
  });

  revalidatePath("/settings");
}

export async function deleteCarouselImageAction(
  formData: FormData
): Promise<void> {
  await requireSuperAdmin();

  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await prisma.carouselImage.delete({
    where: {
      id,
    },
  });

  revalidatePath("/settings");
}

export async function addBestSellerProductAction(
  _previousState: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  await requireSuperAdmin();

  const rawData = {
    productId: String(formData.get("productId") ?? ""),
    bestSellerOrder: String(formData.get("bestSellerOrder") ?? "0"),
  };

  const validation = bestSellerSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: validation.data.productId,
    },
    include: {
      category: true,
    },
  });

  if (!product) {
    return {
      error: "Produit introuvable.",
    };
  }

  if (
    product.isArchived ||
    !product.isVisible ||
    product.category.isArchived ||
    !product.category.isActive ||
    !product.category.isVisible
  ) {
    return {
      error:
        "Le produit doit être visible, non archivé et associé à une catégorie active.",
    };
  }

  await prisma.product.update({
    where: {
      id: validation.data.productId,
    },
    data: {
      isBestSeller: true,
      bestSellerOrder: validation.data.bestSellerOrder,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/products");

  return {
    success: "Produit ajouté à la section Best Seller.",
  };
}

export async function updateBestSellerOrderAction(
  formData: FormData
): Promise<void> {
  await requireSuperAdmin();

  const rawData = {
    productId: String(formData.get("productId") ?? ""),
    bestSellerOrder: String(formData.get("bestSellerOrder") ?? "0"),
  };

  const validation = updateBestSellerOrderSchema.safeParse(rawData);

  if (!validation.success) {
    return;
  }

  await prisma.product.update({
    where: {
      id: validation.data.productId,
    },
    data: {
      bestSellerOrder: validation.data.bestSellerOrder,
    },
  });

  revalidatePath("/settings");
}

export async function removeBestSellerProductAction(
  formData: FormData
): Promise<void> {
  await requireSuperAdmin();

  const productId = String(formData.get("productId") ?? "");

  if (!productId) {
    return;
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      isBestSeller: false,
      bestSellerOrder: 0,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/products");
}