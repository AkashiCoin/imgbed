import { Env } from "../interface";

const validateJWT = async (jwtAssertion: string | null, aud: string) => {
  // If the JWT is valid, return the JWT payload
  // Else, return false
  // https://developers.cloudflare.com/cloudflare-one/identity/users/validating-json

  return jwtPayload;
};

const cloudflareAccessMiddleware: PagesFunction<Env> =
  async ({ request, env, next, data }) => {
    const { aud } = (await env.IMAGES.get("setup", "json")) as Setup;

    const jwtPayload = await validateJWT(
      request.headers.get("CF-Access-JWT-Assertion"),
      aud
    );

    if (jwtPayload === false)
      return new Response("Access denied.", { status: 403 });

    // We could also use the data object to pass information between middlewares
    data.user = jwtPayload.email;

    return await next();
  };

export const onRequest = [cloudflareAccessMiddleware];