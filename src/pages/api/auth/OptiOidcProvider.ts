const prod = process.env.NODE_ENV === 'production'
export default function OptiOidcProvider (options: Record<string, any>) {
    return {
        id: "optimizely_cms",
        name: "Musicfestival",
        type: "oauth",
        version: "2.0",
        wellKnown: `${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/.well-known/openid-configuration`,
        authorization: { params: { 
            scope: "openid profile offline_access email roles",
            grant_type: "authorization_code",
            redirect_uri: `${process.env.NEXTAUTH_URL}api/auth/callback/optimizely_cms`,
        } },
        authorizationUrl: `${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/api/episerver/connect/authorize?response_type=code`,
        requestTokenUrl: `${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/api/episerver/connect/authorize`,
        accessTokenUrl: `${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/api/episerver/connect/token`,
        jwks_endpoint: `${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/.well-known/jwks`,
        userinfo: `${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/api/episerver/connect/userinfo`,
        checks: ['pcke', 'state', 'none'],
        style: {
            logo: `${prod ? process.env.NEXTAUTH_URL : process.env.VERCEL_URL}/optimizely.png`,
            logoDark: `${prod ? process.env.NEXTAUTH_URL : process.env.VERCEL_URL}/optimizely.png`,
        },
        profile(profile: any) {
            profile.id = profile.sub
            return profile
        },
        options,
      }
}