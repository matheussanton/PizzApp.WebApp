import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import {parseCookies, destroyCookie} from 'nookies'
import {AuthTokenError} from '../services/errors/AuthTokenError'


//funcao paginas que so podem ser acessadas por usuários logados
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (context : GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(context);

        //Se tentar acessar a página e ja possuir login, retorna.
        if(!cookies['@pizzapp.token']){
            return{
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try {
            return await fn(context);
        }
        catch (error) {
            if(error instanceof AuthTokenError) {
                destroyCookie(context, '@pizzapp.token')

                return{
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }
    }
}
