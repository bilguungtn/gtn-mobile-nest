import { PrismaClient } from '@prisma/client';
import { HttpException } from '@nestjs/common';
import { PrismaClient as PrismaClient2 } from '@prisma/client-2';
import {
  carrierTypeCode,
  deadlineFormat,
  formatAvailableCount,
  formatCapacity,
  formatPrice,
} from '../src/common/helpers/csv.helper';
import { readFile } from 'fs';
import { parse } from 'papaparse';

const client = new PrismaClient();
const client2 = new PrismaClient2();

export const importPlan = async () => {
  try {
    readFile('files/plan_data.csv', async function (err, fileData) {
      const csvParse = parse(fileData.toString(), {
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: function (chunk) {
          const rows = chunk.split(/\r\n|\r|\n/);
          rows[0] =
            'item_name, capacity_gb, name, plan_group_id, capacity_mb, price, time_display, happiness_id, happiness_name, charge_plan, carrier_type, deadline_time';
          return rows.join('\r\n');
        },
        transformHeader: (header) =>
          header.toLowerCase().replace('#', '').trim(),
        complete: (results) => results.data,
      });
      ``;

      const { data } = csvParse;

      if (!data) throw new HttpException('bad request', 400);
      await client.plan_groups.deleteMany();

      for (const item of data) {
        // header name ni csv deeree yapon
        const planGroupId = item['plan_group_id'];
        // deadline parse
        const deadline = deadlineFormat(item['deadline_time']);
        if (planGroupId !== '-' && planGroupId) {
          const planItem = {
            id: +item['happiness_id'],
            name: item['name'],
            happiness_name: item['happiness_id'],
            capacity:
              Object.values(item)[1] === 'なし'
                ? null
                : parseFloat(item['capacity']),
            carrier_type_code: carrierTypeCode(item['carrier_type']),
          };
          await client.plan_groups.upsert({
            where: { id: +planGroupId },
            create: {
              id: +planGroupId,
              deadline_day: deadline.deadline_day,
              deadline_time: deadline.deadline_time,
              available_change_plan: true,
              current_plan: true,
              plans: {
                create: planItem,
              },
            },
            update: {
              deadline_day: deadline.deadline_day,
              deadline_time: deadline.deadline_time,
              available_change_plan: true,
              current_plan: true,
              plans: {
                create: planItem,
              },
            },
          });
          createDataCharge(item);
        }
      }
    });
    return 'success';
  } catch (error) {
    console.log(error);
  }
};

export const importPlanWithPrice = async () => {
  try {
    readFile('files/plan_data_with_price.csv', async function (err, fileData) {
      const csvParse = parse(fileData.toString(), {
        header: true,
        skipEmptyLines: true,
        beforeFirstChunk: function (chunk) {
          const rows = chunk.split(/\r\n|\r|\n/);
          rows[0] =
            'item_name,capacity,name,price,plan_group_id,happiness_id,happiness_name,charge_plan,deadline_time,';
          return rows.join('\r\n');
        },
        transformHeader: (header) =>
          header.toLowerCase().replace('#', '').trim(),
        complete: (results) => results.data,
      });
      ``;
      const { data } = csvParse;
      console.log(data, 'data');
      if (!data) throw new HttpException('bad request', 400);
      for (const item of data) {
        if (item['price'] !== '')
          await client.plans.update({
            where: { id: +item['happiness_id'] },
            data: {
              price: formatPrice(item['price']),
            },
          });
      }
    });
    return 'success';
  } catch (error) {
    console.log(error);
  }
};

export const createDataCharge = async (data) => {
  try {
    const capacityString = data.capacity_mb;
    if (capacityString === '不可' || capacityString === '') return null;
    const capacity = formatCapacity(capacityString);
    const price = formatPrice(data.price);
    const available_count = formatAvailableCount(data.time_display);

    const data_charge = await client.data_charges.create({
      data: {
        capacity,
        price,
        available_count,
        plan_groups_id: +data.plan_group_id,
      },
    });
    return data_charge;
  } catch (error) {}
};
