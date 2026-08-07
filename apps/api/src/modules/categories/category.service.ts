import { categoryRepository } from './category.repository';
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema';
import { Conflict, NotFound, BadRequest } from '../../common/errors/AppError';

export const categoryService = {
  list: () => categoryRepository.findAll(),

  async getById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw NotFound('Kategori bulunamadı');
    return category;
  },

  async create(input: CreateCategoryInput) {
    const existing = await categoryRepository.findBySlug(input.slug);
    if (existing) throw Conflict('Bu slug zaten kullanımda');

    // parentId verildiyse gerçekten var mı kontrol et
    if (input.parentId) {
      const parent = await categoryRepository.findById(input.parentId);
      if (!parent) throw BadRequest('Üst kategori bulunamadı');
    }

    return categoryRepository.create(input);
  },

  async update(id: string, input: UpdateCategoryInput) {
    await this.getById(id); // yoksa NotFound fırlatır

    if (input.slug) {
      const existing = await categoryRepository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw Conflict('Bu slug zaten kullanımda');
      }
    }

    // Kategori kendi kendisinin alt kategorisi olamaz
    if (input.parentId === id) {
      throw BadRequest('Kategori kendisinin alt kategorisi olamaz');
    }

    return categoryRepository.update(id, input);
  },

  async remove(id: string) {
    await this.getById(id);

    // İçinde ürün varsa silmeye izin verme
    const productCount = await categoryRepository.countProducts(id);
    if (productCount > 0) {
      throw BadRequest(
        `Bu kategoride ${productCount} ürün var, önce onları taşıyın`
      );
    }

    return categoryRepository.delete(id);
  },
};
