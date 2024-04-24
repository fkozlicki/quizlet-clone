import { getFileFromS3 } from "~/lib/aws";

export async function GET(
  request: Request,
  { params: { name } }: { params: { name: string } },
) {
  if (!name) {
    return new Response("Bad params", {
      status: 400,
      statusText: "Bad request",
    });
  }

  const res = await getFileFromS3(name);

  if (!res) {
    return new Response("Could not serve file", {
      status: 500,
      statusText: "Bad request",
    });
  }

  const buffer = await res.transformToByteArray();

  return new Response(Buffer.from(buffer));
}
