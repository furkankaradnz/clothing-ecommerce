import { addressRepository } from './address.repository';
import { CreateAddressInput, UpdateAddressInput } from './address.schema';
import { NotFound, Forbidden } from '../../common/errors/AppError';

export const addressService = {
  list: (userId: string) => addressRepository.findByUser(userId),

  // Adresin gerçekten bu kullanıcıya ait olduğunu doğrular.
  // Başkasının adresini görmeyi/değiştirmeyi engeller.
  async getOwned(userId: string, addressId: string) {
    const address = await addressRepository.findById(addressId);
    if (!address) throw NotFound('Adres bulunamadı');
    if (address.userId !== userId) {
      throw Forbidden('Bu adrese erişim yetkiniz yok');
    }
    return address;
  },

  async create(userId: string, input: CreateAddressInput) {
    // Varsayılan olarak işaretlendiyse, önceki varsayılanı kaldır
    if (input.isDefault) {
      await addressRepository.clearDefault(userId);
    }
    return addressRepository.create(userId, input);
  },

  async update(userId: string, addressId: string, input: UpdateAddressInput) {
    await this.getOwned(userId, addressId);
    if (input.isDefault) {
      await addressRepository.clearDefault(userId);
    }
    return addressRepository.update(addressId, input);
  },

  async remove(userId: string, addressId: string) {
    await this.getOwned(userId, addressId);
    return addressRepository.delete(addressId);
  },
};
