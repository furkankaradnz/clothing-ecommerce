import { prisma } from '../../config/prisma';
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema';

export const categoryRepository = {
  findAll: () =>
    prisma.category.findMany({
      include: { children: true },
      orderBy: { name: 'asc' },
    }),

  findById: (id: string) =>
    prisma.category.findUnique({
      where: { id },
      include: { children: true, parent: true },
    }),

  findBySlug: (slug: string) =>
    prisma.category.findUnique({ where: { slug } }),

  create: (data: CreateCategoryInput) =>
    prisma.category.create({ data }),

  update: (id: string, data: UpdateCategoryInput) =>
    prisma.category.update({ where: { id }, data }),

  delete: (id: string) => prisma.category.delete({ where: { id } }),

  countProducts: (id: string) =>
    prisma.product.count({ where: { categoryId: id } }),
};
