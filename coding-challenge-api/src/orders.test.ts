import * as orders from './orders';
import { Request, Response } from 'express';

describe('readShopInfo', () => {
  it('should return an array of StoreInfo objects', async () => {
    const storeInfo = await orders.readShopInfo();
    expect(Array.isArray(storeInfo)).toBe(true);
    expect(storeInfo.length).toBeGreaterThan(0);
    expect(storeInfo[0]).toHaveProperty('storeId');
    expect(storeInfo[0]).toHaveProperty('marketplace');
    expect(storeInfo[0]).toHaveProperty('country');
    expect(storeInfo[0]).toHaveProperty('shopName');
  });
});

describe("getOrders", () => {
  beforeEach(() => {
    jest.spyOn(orders, 'readOrderInfo').mockReturnValue(Promise.resolve([
      {
          Id: "1",
          storeId: "1",
          orderId: "ORLIAPICLS",
          latest_ship_date: "01/01/2023",
          shipment_status: "Pending",
          destination: "VIC AU, 3769",
          items: "2",
          orderValue: "50.0",
      },
      {
          Id: "2",
          storeId: "3",
          orderId: "ORGG7YHW5F",
          latest_ship_date: "4/10/2022",
          shipment_status: "Shipped",
          destination: "LA US, 90001",
          items: "4",
          orderValue: "126.78",
      },
    ]));
  
    jest.spyOn(orders, 'readShopInfo').mockReturnValue(Promise.resolve([
      {
        storeId: '1',
        marketplace: 'Amazon',
        country: 'AUS',
        shopName: 'Shoes Plus',
      },
      {
        storeId: '2',
        marketplace: 'Ebay',
        country: 'GBR',
        shopName: 'Snack Co.',
      },
    ]));
  });

  const expectedOrders = [
    {
      Id: "1",
      daysOverdue: 407,
      destination: "VIC AU, 3769",
      items: "2",
      latest_ship_date: "01/01/2023",
      marketplace: "Amazon",
      orderId: "ORLIAPICLS",
      orderValue: "50.0",
      shipment_status: "Pending",
      storeCountry: "AUS",
      storeId: "1",
      storeName: "Shoes Plus"
    },
    {
      Id: "2",
      daysOverdue: 496,
      destination: "LA US, 90001",
      items: "4",
      latest_ship_date: "4/10/2022",
      marketplace: "Amazon",
      orderId: "ORGG7YHW5F",
      orderValue: "126.78",
      shipment_status: "Shipped",
      storeCountry: "USA",
      storeId: "3",
      storeName: "Great Jeans"
    }
  ];
  
  test("Returns truthy response when called", async () => {
    let responseObject = {};
    const req = {};
    const res: Partial<Response> = {
      json: jest.fn().mockImplementation(result => responseObject = result),
      status: jest.fn(() => res as unknown as Response),
    };

    await orders.getOrders(req as Request, res as Response);

    console.log("responseObject", responseObject);
  
    expect(responseObject).toBeTruthy();
    expect(responseObject).toContainEqual(expectedOrders[0]);
    expect(responseObject).toContainEqual(expectedOrders[1]);
  });

});