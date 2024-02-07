import fs from 'fs';
import { parse } from 'csv-parse';

type StoreInfo = {
  storeId: string;
  marketplace: string;
  country: string;
  shopName: string;
}

type Order = {
  Id: string;
  storeId: string;
  storeName?: string;
  storeCountry?: string;
  orderId: string;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: string;
  orderValue: string;
  marketplace?: string;
  daysOverdue?: number;
}

export function convertShopInfo(): Promise<StoreInfo[]> {
  const stores: StoreInfo[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream("./data/stores.csv")
      .pipe(parse({ delimiter: ",", columns: true, ltrim: true }))
      .on("data", row => stores.push(row))
      .on("error", error => {
        console.log(error.message);
        reject(error);
      })
      .on("end", () => {
        console.log("finished getting stores");
        resolve(stores);
      });
  });
}

export function calcDaysOverdue(date: string): number {
  const today = new Date();
  const dateArr = date.split('/');
  const lastShipmentDate = new Date(+dateArr[2], (+dateArr[1] - 1), +dateArr[0]);
  return Math.round((today.getTime() - new Date(lastShipmentDate).getTime()) / (1000 * 3600 * 24));
}

export async function getOrders(req: any, res: any) {
  try {
    const orders: Order[] = [];
    const stores: StoreInfo[] = await convertShopInfo();

    fs.createReadStream("./data/orders.csv")
      .pipe(parse({ delimiter: ",", columns: true, ltrim: true }))
      .on("data", row => {
        const matchedStore = stores.find(store => store.storeId == row.storeId);
        row.storeName = matchedStore?.shopName;
        row.marketplace = matchedStore?.marketplace;
        row.storeCountry = matchedStore?.country;
        row.daysOverdue = calcDaysOverdue(row.latest_ship_date);
        orders.push(row);
      })
      .on("error", error => {
        console.log(error.message);
        return res.status(500);
      })
      .on("end", () => {
        console.log("finished getting orders");
        return res.status(200).json(orders);
      });
  } catch (e) {
    return res.status(500).json(e);
  }
}