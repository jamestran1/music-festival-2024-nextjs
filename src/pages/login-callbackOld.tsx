import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { redirect } from 'next/navigation'
import { GetServerSideProps } from 'next';
import { Session } from 'next-auth';

type ExtendedSession = Session & {
    token: any
  }

export type ContextProps = {
    context: any
}

export const getServerSideProps: GetServerSideProps<ContextProps> =
  async context => ({ props: { context: {host: context.req.headers.host || ''} } });

export default function LoginCallbackPage(props: ContextProps) {
    const { update } = useSession()
    const router = useRouter();
    const { query } = router;
    const {code} = query;

    const handleGetAccessToken = async (context: ContextProps) => {
        const originalUrl = context.context.host;
        const redirect_uri = originalUrl + '/login-callback';
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOGIN_AUTHORITY}/api/episerver/connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: `${code}`,
                redirect_uri: redirect_uri,
                client_id: 'frontend',
                code_verifier: `123`,
            }),
        });

        const data = await response.json();

        if (response.status == 200) {
            update({...data, token: {accessToken: data.access_token, refreshToken: data.refresh_token}} as ExtendedSession)
            console.log('data: ', data);
            sessionStorage.setItem('accessToken', data.access_token); // save accessToken to sessionStorage   
        }        
    };

    handleGetAccessToken(props).then(() => {
        router.push('/');
    });

    return <></>;
};

;