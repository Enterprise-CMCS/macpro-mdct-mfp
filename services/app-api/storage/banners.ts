import { DeleteCommand, paginateScan, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient } from "./dynamodb-lib";
import { AdminBannerData } from "../utils/types/banner";
import { AnyObject } from "../utils/types";

const bannerTableName = process.env.BannerTable!;
const client = createClient();

export const putBanner = async (banner: AdminBannerData) => {
  await client.send(
    new PutCommand({
      TableName: bannerTableName,
      Item: banner,
    })
  );
};

export const getBanners = async () => {
  let items: AnyObject[] = [];
  const params = {
    TableName: bannerTableName,
  };

  for await (const page of paginateScan({ client }, params)) {
    items = items.concat(page.Items ?? []);
  }

  return items as AdminBannerData[] | undefined;
};

export const deleteBanner = async (bannerId: string) => {
  await client.send(
    new DeleteCommand({
      TableName: bannerTableName,
      Key: {
        key: bannerId,
      },
    })
  );
};
