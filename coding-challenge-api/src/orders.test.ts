import { convertShopInfo } from './orders';

describe('convertShopInfo', () => {
  it('should return an array of StoreInfo objects', async () => {
    const storeInfo = await convertShopInfo();
    expect(Array.isArray(storeInfo)).toBe(true);
    expect(storeInfo.length).toBeGreaterThan(0);
    expect(storeInfo[0]).toHaveProperty('storeId');
    expect(storeInfo[0]).toHaveProperty('marketplace');
    expect(storeInfo[0]).toHaveProperty('country');
    expect(storeInfo[0]).toHaveProperty('shopName');
  });
});
