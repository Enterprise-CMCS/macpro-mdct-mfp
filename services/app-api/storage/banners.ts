import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { createClient } from "./dynamodb-lib";
import { AdminBannerData } from "../utils/types/banner";

const bannerTableName = process.env.BANNER_TABLE_NAME!;
const client = createClient();

export const putBanner = async (banner: AdminBannerData) => {
  await client.send(
    new PutCommand({
      TableName: bannerTableName,
      Item: banner,
    })
  );
};

export const getBanner = async (bannerId: string) => {
  const response = await client.send(
    new GetCommand({
      TableName: bannerTableName,
      Key: {
        key: bannerId,
      },
    })
  );
  return response.Item as AdminBannerData | undefined;
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
