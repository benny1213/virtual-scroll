import { v4 as uuidv4 } from 'uuid';
import faker from 'faker';
import { DataStruct } from './interface';

const generateListData = (count: number): DataStruct[] => {
  return [...new Array(count)].map(() => {
    const id = uuidv4();
    return {
      id: id,
      color: faker.commerce.color(),
      name: faker.name.findName(),
      content: faker.lorem.sentence(),
      time: faker.time.recent()
    }
  })
}

export const getListData = (count: number): Promise<DataStruct[]> =>
  new Promise((resolve) => {
    const listData = generateListData(count);
    resolve(listData)
  })
