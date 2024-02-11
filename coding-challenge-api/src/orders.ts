import { Request, Response } from 'express';
import fs from 'fs';
import { parse } from 'csv-parse';

type Store = {
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

export function readOrderInfo(): Promise<Order[]> {
  let orders: Order[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream("./data/orders.csv")
      .pipe(parse({ delimiter: ',', columns: true, ltrim: true }))
      .on("data", row => orders.push(row))
      .on("error", error => reject(error))
      .on("end", () => resolve(orders));
  });
}

export function readShopInfo(): Promise<Store[]> {
  let stores: Store[] = [];

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

export async function getOrders(req: Request, res: Response) {

  try {
    const stores: Store[] = await readShopInfo();
    const orders: Order[] = await readOrderInfo();

    const updatedOrders = orders.map(order => {
      const matchedStore = stores.find(store => store.storeId == order.storeId);

      return {
        ...order,
        storeName: matchedStore?.shopName,
        marketplace: matchedStore?.marketplace,
        storeCountry: matchedStore?.country,
        daysOverdue: calcDaysOverdue(order.latest_ship_date),
      };
    });

    return res.status(200).json(updatedOrders);
  } catch (error) {
    console.log("error::", error);
    return res.status(500).json(error);
  }

}